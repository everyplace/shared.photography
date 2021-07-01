store-uploaded-images
=================

This project accepts an image via a POST payload to /upload, which is then stored in .data, and is accessible via /display (to see a list of images), /preview (to see all of the images), and /list (to receive a json object of image titles). All images are accessible via /img/<file name>.

The .data folder at the root of Glitch projects does not get copied over to remixed subsequent projects. This project facilitates the easy uploading of images to that folder.