import { redirect } from "next/navigation";

export default function Home() {
  const initialFormatedDate = process.env.INITIAL_DATE;

  if (!initialFormatedDate) {
    return <code>Initial date is not set</code>;
  }

  return redirect(`/${initialFormatedDate}`);
}
