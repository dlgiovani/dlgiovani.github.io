export async function submitEntry(_name: string, _city: string, _msg: string): Promise<void> {
  await new Promise(r => setTimeout(r, 400));
}
