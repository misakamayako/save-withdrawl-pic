import QRCode from 'qrcode'

export default async function QRCodeService(url: string): Promise<string> {
    return QRCode.toDataURL(url)
}