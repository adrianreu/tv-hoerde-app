/**
 * A set of functions called "actions" for `post-importer`
 */
import axios from 'axios';

async function importPosts() {
  let currentPage = 1;
  let totalPages = 1;
  do {
    try {
      console.log(`[post-importer] importing posts page ${currentPage}/${totalPages}`)
      const { data, headers } = await axios.get(`https://tvhoerde.de/wp-json/wp/v2/posts?page${currentPage}&per_page=100`);
      totalPages = headers['x-wp-totalpages'] || 0;
      console.log(totalPages);
      const oldImageData =
      const map = data.map(async (post) => {
        const images = [];
        if (post?._links['wp:featuredmedia']) {
          const mediaLinks = post._links['wp:featuredmedia'].map(media => media.href);
          // console.log(mediaLinks)
        }
        if (post?._links['wp:attachment']) {
          const attachmentLinks = post._links['wp:attachment'].map(attachment => attachment.href);
          console.log(attachmentLinks)
        }
        // const responses = await Promise.all(mediaLinks.map(async (url) => {
        //   const { data } = await axios.get(url);
        //   if (Array.isArray(data)) {
        //     images.push(data.map((attachment) => ({
        //       id: attachment.id,
        //       url: attachment.media_details.sizes.full.source_url
        //     })));
        //     return;
        //   }
        //   images.push({
        //     id: data.id,
        //     url: data.media_details.sizes.full.source_url
        //   })
        // }));
        // console.log(responses);
        return {
          title: post.title.rendered,
          text: post.content.rendered,
          createdAt: post.date,
        }
      });
      // console.log(map);
      currentPage += 1;
    } catch (err) {
      totalPages = 0;
    }
  } while (totalPages >= currentPage);
}

export default {
  startImport: async (ctx, next) => {

    importPosts();
    ctx.body = {
      message: 'import started',
      status: 'ok'
    };
  }
};
