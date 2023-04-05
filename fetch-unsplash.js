import {createApi} from 'unsplash-js';
import nodeFetch from 'node-fetch'
import fs from 'fs';


const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
    fetch: nodeFetch,
});

unsplash.photos
    .getRandom({
        orientation: "landscape",
        contentFilter: "high",
        count: 24,
        topicIds: ["nature", "travel"]
    })
    .then(result => {
        if (result.errors) {
            console.log('errors: ', result.errors);
        } else {
            // handle success here
            const photos = result.response.map(photo => ({
                id: photo.id,
                url: photo.urls.regular,
                user: photo.user.name,
                creditLink: photo.links.html
            }));
            fs.writeFile('./src/unsplash.json', JSON.stringify(photos), err => {
                if (err) {
                    console.error(err);
                }
            })
        }
    })