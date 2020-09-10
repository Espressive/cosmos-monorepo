import Head from 'next/head';
import hydrate from 'next-mdx-remote/hydrate';
import getMDXTree from '../lib/getMDXTree';
import { POSTS_PATH, postFilePaths } from '../lib/mdxUtils';
import MDX_COMPONENTS from '../lib/MDX_COMPONENTS';
import MDX_OPTIONS from '../lib/MDX_OPTIONS';

export default function Home({ source, frontMatter }) {
  const content = hydrate(source, { components: MDX_COMPONENTS });
  return (
    <>
      <Head>
        <meta
          content='https://cascara.design/cascara_meta.png'
          key='large_image'
          name='twitter:card'
        />
      </Head>

      {content}
    </>
  );
}

export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');
  const matter = require('gray-matter');
  const renderToString = require('next-mdx-remote/render-to-string');

  const postFilePath = path.join(POSTS_PATH, 'index.mdx');
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
    // Keep this here for updates to the MDX files
    revalidate: 1,
  };
}
