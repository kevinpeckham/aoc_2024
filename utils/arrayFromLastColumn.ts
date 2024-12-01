export default function arrayFromLastColumn(data: string): string[] {
	return (data.match(/\d+$/gm) as string[]) ?? [];
}
