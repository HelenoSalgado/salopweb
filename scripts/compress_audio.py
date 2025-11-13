
import os
import subprocess
import sys

def compress_audio_files():
    """
    Scans the public/podcast directory, converts and compresses audio files to 96k MP3s,
    and removes the original files upon successful conversion.
    """
    podcast_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'podcast')
    
    if not os.path.isdir(podcast_dir):
        print(f"Erro: Diretório não encontrado em '{os.path.abspath(podcast_dir)}'")
        sys.exit(1)

    print(f"Analisando diretório: {os.path.abspath(podcast_dir)}")

    supported_extensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.aiff']
    files_to_process = []

    for filename in os.listdir(podcast_dir):
        file_ext = os.path.splitext(filename)[1].lower()
        if file_ext in supported_extensions:
            files_to_process.append(filename)

    if not files_to_process:
        print("Nenhum arquivo de áudio para processar.")
        return

    for filename in files_to_process:
        input_path = os.path.join(podcast_dir, filename)
        base_name = os.path.splitext(filename)[0]
        output_filename = f"{base_name}.mp3"
        output_path = os.path.join(podcast_dir, output_filename)
        temp_output_path = os.path.join(podcast_dir, f"{base_name}_temp.mp3")

        print(f"\nProcessando '{filename}'...")

        # ffmpeg command to convert to mp3 at 96k bitrate
        command = [
            'ffmpeg',
            '-i', input_path,
            '-vn',                # Remove any video track if present
            '-c:a', 'libmp3lame', # Use LAME encoder for MP3
            '-b:a', '96k',        # Constant bitrate at 96k (keeps file < 24MB for ~20-25min)
            '-write_xing', '1',   # Force writing Xing/Info header to enable accurate seeking
            '-map_metadata', '-1',# Drop all metadata that could carry odd container tags (dash/mp4)
            '-y',                 # Overwrite output file if it exists
            temp_output_path
        ]

        try:
            # Execute the command
            result = subprocess.run(command, check=True, capture_output=True, text=True)
            
            # If successful, replace the old file
            print(f"Compressão bem-sucedida para '{temp_output_path}'")

            # If the original file is not the target mp3 file, remove it
            if input_path != output_path:
                os.remove(input_path)
                print(f"Arquivo original '{filename}' removido.")
            
            # Rename temp file to final name
            os.rename(temp_output_path, output_path)
            print(f"Arquivo final salvo como '{output_filename}'")

        except subprocess.CalledProcessError as e:
            print(f"Erro ao comprimir '{filename}':")
            print(e.stderr)
            # Clean up temp file on error
            if os.path.exists(temp_output_path):
                os.remove(temp_output_path)
        except FileNotFoundError:
            print("Erro: 'ffmpeg' não encontrado. Por favor, instale o ffmpeg e certifique-se de que está no PATH do seu sistema.")
            sys.exit(1)
        except Exception as e:
            print(f"Um erro inesperado ocorreu com o arquivo '{filename}': {e}")
            # Clean up temp file on error
            if os.path.exists(temp_output_path):
                os.remove(temp_output_path)


if __name__ == '__main__':
    compress_audio_files()
