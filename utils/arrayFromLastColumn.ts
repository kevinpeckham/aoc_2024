export function arrayFromLastColumn(data: string): string[] {
	return (data.match(/\d+$/gm) as string[]) ?? [];
}
export default arrayFromLastColumn;
