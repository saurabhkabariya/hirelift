import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPosts } from '../../../data/blogPosts';
import BlogPostPage from '../../../components/blog/BlogPostPage';

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | HireLift',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords?.join(', '),
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
    },
    alternates: {
      canonical: `${'https://www.hirelift.tech'}/blog/${slug}`
    }
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  return <BlogPostPage post={post} />;
}
