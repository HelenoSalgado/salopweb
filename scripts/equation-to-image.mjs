import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

async function createEquationImage() {
  const equation = process.argv[2];


  if (!equation) {
    console.error('Erro: Forneça a equação como um argumento entre aspas.');
    console.error('Exemplo: node scripts/equation-to-image.mjs "E=mc^2"');
    process.exit(1);
  }

  try {
    // Garante que o diretório de destino existe
    const outputDir = path.resolve('public', 'images');
    await fs.mkdir(outputDir, { recursive: true });

    // Gera um nome de arquivo único e consistente baseado no conteúdo da equação
    const hash = crypto.createHash('sha1').update(equation).digest('hex').slice(0, 12);
    const imageName = `eq-${hash}.svg`;
    const imagePath = path.join(outputDir, imageName);

    const finalEquation = `\huge ${equation}`;

    // Codifica a equação para uso na URL
    const encodedEquation = encodeURIComponent(finalEquation);
    const url = `https://latex.codecogs.com/svg.latex?${encodedEquation}`;

    // Faz o download da imagem
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Falha ao buscar a imagem. Status: ${response.status} ${response.statusText}`);
    }
    const svgContent = await response.text();

    // Salva o arquivo
    await fs.writeFile(imagePath, svgContent);

    // Imprime o nome do arquivo no console
    console.log(imageName);

  } catch (error) {
    console.error('Ocorreu um erro ao gerar a imagem da equação:', error.message);
    process.exit(1);
  }
}

createEquationImage();
