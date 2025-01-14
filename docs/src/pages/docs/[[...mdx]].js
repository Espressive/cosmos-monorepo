import { useEffect } from 'react';
import { useRouter } from 'next/router';
import pt from 'prop-types';
import hydrate from 'next-mdx-remote/hydrate';
import Head from 'next/head';

import { Tabs } from '../../components';
import { postFilePaths, POSTS_PATH } from '../../lib/mdxUtils';
import MDX_COMPONENTS from '../../lib/MDX_COMPONENTS';
import MDX_OPTIONS from '../../lib/MDX_OPTIONS';
import getMDXTree from '../../lib/getMDXTree';
import getMDXDirFiles from '../../lib/getMDXDirFiles';

const MODULE_MESSAGE = (
  <blockquote>
    <p>
      <em>
        <a href='/40-modules'>Modules</a> are private components that are used
        inside of <a href='/docs/ui/Form'>Form</a> and{' '}
        <a href='/docs/ui/Form'>Table</a>. They are not exported from Cascara
        and cannot be used independently.
      </em>
    </p>
  </blockquote>
);

const propTypes = {
  mdxDirSource: pt.arrayOf(
    pt.shape({
      frontMatter: pt.shape({
        description: pt.shape(),
        title: pt.string,
      }),
      frontmatter: pt.shape({
        description: pt.shape(),
        title: pt.string,
        type: pt.string,
      }),
      router: pt.shape(),
    })
  ),
};

const Doc = ({ mdxDirSource }) => {
  // const [activeDoc, setActiveDoc] = useState(0);
  const router = useRouter();

  const activeSource = mdxDirSource[router?.query?.doc || 0];

  // Set the query parameter to 0 if none is set and make
  // sure we are doing this as a replace() in history
  useEffect(() => {
    if (router?.query?.doc === undefined) {
      router.replace(
        {
          pathname: router.pathname,
          query: { doc: 0 },
        },
        {
          pathname: router.asPath.split('?')[0],
          query: { doc: 0 },
        },
        { shallow: true }
      );
    }
  }, [router]);

  const mdxActive = hydrate(activeSource, {
    components: MDX_COMPONENTS,
  });

  // TODO: Update the top level navigation to a tab UI once we have the components to support it
  return (
    <>
      <Head>
        <title>{router?.query?.mdx[1]} - Cascara</title>
        {mdxDirSource?.[0]?.frontMatter?.description && (
          <meta
            content={mdxDirSource[0].frontMatter.description}
            key='description'
            name='description'
          />
        )}
      </Head>

      {mdxDirSource.length > 1 && (
        <Tabs>
          {mdxDirSource.map((doc, i) => (
            <Tabs.Tab
              as={{
                pathname: router.asPath.split('?')[0],
                query: { doc: i },
              }}
              content={doc?.frontmatter?.title || doc.fileName}
              href={{
                pathname: router.pathname,
                query: { doc: i },
              }}
              isActive={Number(router?.query?.doc) === i}
              key={i}
            />
          ))}
        </Tabs>
      )}

      {activeSource?.frontmatter?.title && (
        <h1>{activeSource.frontmatter.title}</h1>
      )}
      {activeSource?.frontmatter?.type === 'module' && MODULE_MESSAGE}

      {mdxActive}
    </>
  );
};

const getStaticPaths = async () => {
  const tree = getMDXTree();

  const staticPaths = [];

  tree.forEach((element) => {
    const { name, children } = element;
    children.forEach((child) => {
      // We only want a static path for directories that have files in them.
      // Technically the file size returned is based on the files being filtered
      // in getMDXTree() which are only MDX files at this time.
      if (child?.type === 'directory' && child?.size > 0) {
        staticPaths.push({ params: { mdx: [name, child.name] } });
      }
    });
  });

  return {
    fallback: false,
    paths: staticPaths,
  };
};

const getStaticProps = async ({ params }) => {
  const {
    version: cascaraVersion,
  } = require('../../../../packages/cascara/package');
  // Any deps needed for getStaticProps should be declared as requirements
  // here instead of at the top of a file
  const matter = require('gray-matter');
  const reactDocgen = require('react-docgen');
  const path = require('path');
  const fs = require('fs');
  const renderToString = require('next-mdx-remote/render-to-string');

  const mdxDir = getMDXDirFiles(params);

  // We need to make sure this is only actual files and not a directory
  // so we are filtering it to make sure the size of the file is not zero.
  const mdxDirFiles = mdxDir.filter(({ type }) => type !== 'directory');

  // This needs to be async or it will blow up since `next-mdx-remote` is
  // asyncrhonously getting all MDX files and rendering them to string.
  // Without the Promise.all pattern this will blow up on us.

  const mdxDirSource = await Promise.all(
    mdxDirFiles.map(async (file) => {
      const filePath = path.join(process.cwd(), file.path);

      const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));

      const fileSource = await renderToString(content, {
        components: MDX_COMPONENTS,
        mdxOptions: MDX_OPTIONS,
      });

      const tableComponents = data.propTable?.split(' ') || [];

      const docData = tableComponents.map((component) => {
        const componentPath = path.join(
          process.cwd(),
          path.dirname(file.path),
          component
        );

        return reactDocgen.parse(fs.readFileSync(componentPath, 'utf8'));
      });

      return {
        docData,
        fileName: file.name,
        frontmatter: data,
        ...fileSource,
      };
    })
  );

  const posts = postFilePaths.map((filePath) => {
    const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
    const { content, data } = matter(source);

    return {
      content,
      data,
      filePath,
    };
  });

  return {
    props: {
      branch: process.env?.GIT_BRANCH,
      cascaraVersion,
      mdxDirFiles,
      mdxDirSource,
      mdxTree: getMDXTree(),
      params: {
        mdx: [],
      },
      posts,
    },
    // Keep this here for updates to the MDX file
    revalidate: 1,
  };
};

Doc.propTypes = propTypes;

export { getStaticPaths, getStaticProps };
export default Doc;
