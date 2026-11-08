export interface DonationConfig {
  title: string;
  subtitle: string;
  description: string;
  pixKey: string;
  pixCopiaECola: string;
  recipientName: string;
  qrCodeImage: string;
  instructions: string;
}

export const DONATION_CONFIG: DonationConfig = {
  title: 'Apoiar o Trabalho',
  subtitle: 'Contribua com a produção independente de ensaios, pesquisas e software livre.',
  description: 'Se as reflexões, artigos ou ferramentas desenvolvidos aqui têm sido úteis ou proveitosos para você, considere apoiar a manutenção e continuidade deste trabalho através do Pix.',
  pixKey: 'contato@heleno.dev',
  pixCopiaECola: '00020126400014br.gov.bcb.pix0118contato@heleno.dev5204000053039865802BR5914HELENO SALGADO6009SAO PAULO62070503***63046295',
  recipientName: 'Heleno Salgado',
  qrCodeImage: '/images/pix-qrcode.svg',
  instructions: 'Abra o aplicativo do seu banco ou carteira digital, escolha pagar via Pix e aponte a câmera para o QR Code, ou utilize a chave por extenso abaixo.'
};
