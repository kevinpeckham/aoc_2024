export default function arrayFromFirstColumn(data: string): string[] {
	return (data.match(/^\d+/gm) as string[]) ?? [];
}
