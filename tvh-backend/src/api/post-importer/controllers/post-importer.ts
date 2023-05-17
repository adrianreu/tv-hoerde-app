/**
 * A set of functions called "actions" for `post-importer`
 */
import axios from 'axios';
import FormData from 'form-data';

async function importPosts() {
  let currentPage = 1;
  let totalPages = 1;
  do {
    try {
      console.log(`[post-importer] importing posts page ${currentPage}/${totalPages}`)
      const { data, headers } = await axios.get(`https://tvhoerde.de/wp-json/wp/v2/posts?page=${currentPage}&per_page=10`);
      totalPages = headers['x-wp-totalpages'] || 0;
      const wordPressPosts = await Promise.all(data.map(async (post) => {
        let images = [];
        console.log(`[post-importer] getting image data of post "${post.title.rendered}"`)
        let links = [];
        try {
          if (post?._links['wp:featuredmedia']) {
            links = [...post._links['wp:featuredmedia'].map(media => media.href)];
          }
          if (post?._links['wp:attachment']) {
            links = [...links, ...post._links['wp:attachment'].map(attachment => attachment.href)];
          }
          // console.log(links);
          for (let i = 0; i < links.length; i++) {
            const link = links[i];
            // console.log(link);
            const { data } = await axios.get(link);
            if (Array.isArray(data)) {
              const attachments = data.map((attachment) => ({
                id: attachment.id,
                url: attachment.media_details.sizes.full.source_url,
                name: attachment.media_details.sizes.full.file,
              }));
              attachments.forEach((attachment) => {
                if (!images.find(image => image.id === attachment.id)) {
                  images.push(attachment)
                }
              })
            } else {
              if (!images.find(image => image.id === data.id)) {
                images.push({
                  id: data.id,
                  url: data.media_details.sizes.full.source_url,
                  name: data.media_details.sizes.full.file,
                })

              }
            }
          }
        } catch (error) {
          console.log(error);
        }
        return {
          title: post.title.rendered,
          text: post.content.rendered,
          createdAt: post.date,
          images,
        }
      }));

      wordPressPosts.forEach(async post => {
        try {
          const entry = await strapi.entityService.create('api::post.post', {
            data: {
              title: post.title,
              text: post.text,
              createdAt: post.createdAt,
              updatedAt: post.createdAt,
              publishedAt: post.createdAt,
            },
          });
          const imageBlobs = [];
          for (let i = 0; i < post.images.length; i++) {
            const image = post.images[i];
            const response = await axios.get(image.url, {
              responseType: 'arraybuffer'
            });
            // console.log(response.headers);
            imageBlobs.push({
              blob: Buffer.from(response.data),
              filename: image.name,
            });
          }
          for (let i = 0; i < imageBlobs.length; i++) {
            const file = imageBlobs[i];
            const form = new FormData();
            form.append('files', file.blob, file.filename);
            form.append('refId', entry.id)
            form.append('ref', 'api::post.post')
            form.append('field', 'images')
            await axios.post('http://127.0.0.1:9123/api/upload', form, {
              headers: {
                'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
      })

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
