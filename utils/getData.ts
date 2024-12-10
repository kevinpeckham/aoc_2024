export async function getData(path: string): Promise<string> {
	const dataRaw = Bun.file(path);
	const data = await dataRaw.text();
	return data;
}
export default getData;
