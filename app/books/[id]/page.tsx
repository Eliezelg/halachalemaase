import BookDetailPage from '@/components/pages/BookDetailPage';

export default async function BookDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <BookDetailPage id={id} />;
}