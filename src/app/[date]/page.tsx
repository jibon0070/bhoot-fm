import { notFound } from "next/navigation";
import z from "zod";
import Audio from "./_components/audio";

const paramsSchema = z.object({
  date: z.coerce.string().date("Invalid date"),
});

export default async function Datea(props: { params: Promise<unknown> }) {
  const safeParams = paramsSchema.safeParse(await props.params);

  if (!safeParams.success) {
    return notFound();
  }

  const date = new Date(safeParams.data.date);

  const isFriday = date.getDay() === 5;

  if (!isFriday) {
    return notFound();
  }

  const url = getUrl(date);

  if (!(await doesEpisodeExists(url))) {
    return notFound();
  }

  return (
    <main>
      <Audio url={url} />
    </main>
  );
}

async function doesEpisodeExists(url: string): Promise<boolean> {
  return fetch(url).then((data) => data.status === 200);
}

function getUrl(date: Date): string {
  const year = date.getFullYear().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `https://dl.bhoot-fm.com/${year}/Bhoot-FM_${year}-${month}-${day}_(Bhoot-FM.com).mp3`;
}
