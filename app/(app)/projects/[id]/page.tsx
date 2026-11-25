import { DetailPage } from "@/modules/projects";

export default async function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  return <DetailPage projectId={id} />;
}
