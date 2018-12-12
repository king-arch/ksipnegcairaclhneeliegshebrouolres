import { FilesCollection } from 'meteor/ostrio:files';

export const Images = new FilesCollection({
  debug: true,
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
 	storagePath: () => {
        return `${process.env.PWD}/uploads`;
  },   onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024 * 1024 * 10 && /png|jpe?g/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  }
});

export default Images;
