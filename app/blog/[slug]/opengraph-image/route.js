import { ImageResponse } from 'next/og';
import { getAllBlogPosts } from '../../../../data/blogPosts';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const { slug } = params;
  const blogPosts = getAllBlogPosts();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return new Response('Post not found', { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '800px',
          }}
        >
          <div
            style={{
              fontSize: 32,
              marginBottom: '20px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '10px 20px',
              borderRadius: '25px',
              fontWeight: 'bold',
            }}
          >
            HireLift Blog
          </div>
          
          <div
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              lineHeight: 1.2,
              marginBottom: '30px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            {post.title}
          </div>
          
          <div
            style={{
              fontSize: 24,
              opacity: 0.9,
              lineHeight: 1.4,
              maxWidth: '600px',
            }}
          >
            {post.excerpt}
          </div>
          
          <div
            style={{
              marginTop: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: 20,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
              }}
            >
              {post.category}
            </div>
            <div>•</div>
            <div>{post.readTime}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
