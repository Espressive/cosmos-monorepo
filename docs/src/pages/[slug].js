import hydrate from 'next-mdx-remote/hydrate';
import Head from 'next/head';
import { POSTS_PATH, postFilePaths } from '../lib/mdxUtils';
import getMDXTree from '../lib/getMDXTree';
import MDX_COMPONENTS from '../lib/MDX_COMPONENTS';
import MDX_OPTIONS from '../lib/MDX_OPTIONS';

export default function PostPage({ source, frontMatter }) {
  const content = hydrate(source, { components: MDX_COMPONENTS });
  return (
    <>
      <Head>
        <title>{frontMatter.title} - Cascara</title>
        <meta
          content={
            frontMatter?.description || "Espressive's Functional Design System"
          }
          key='description'
          name='description'
        />
        <meta content='width=device-width, initial-scale=1.0' name='viewport' />
      </Head>

      <h1>
        {frontMatter.title || 'PLEASE ADD A TITLE TO YOUR MDX FRONTMATTER'}
      </h1>
      {content}
    </>
  );
}

export const getStaticPaths = async () => {
  const paths = postFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }));

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps = async ({ params }) => {
  const fs = require('fs');
  const path = require('path');
  const matter = require('gray-matter');
  const renderToString = require('next-mdx-remote/render-to-string');

  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`);
  const source = fs.readFileSync(postFilePath);

  const posts = postFilePaths.map((filePath) => {
    const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
    const { content, data } = matter(source);

    return {
      content,
      data,
      filePath,
    };
  });

  const { content, data } = matter(source);

  const mdxSource = await renderToString(content, {
    components: MDX_COMPONENTS,
    mdxOptions: MDX_OPTIONS,
    scope: data,
  });

  return {
    props: {
      frontMatter: data,
      mdxTree: getMDXTree(),
      posts,
      source: mdxSource,
    },
  };
};
