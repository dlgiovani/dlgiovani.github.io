export async function submitConsultingRequest(form: FormData, apiUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/api/consulting`, {
      method: 'POST',
      body: form,
    });
    return res.ok;
  } catch {
    return false;
  }
}
