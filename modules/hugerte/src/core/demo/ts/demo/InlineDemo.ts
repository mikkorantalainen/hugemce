import { RawEditorOptions, HugeRTE } from 'hugerte/core/api/PublicApi';

declare let hugerte: HugeRTE;

export default (): void => {

  const settings: RawEditorOptions = {
    selector: '.hugerte',
    inline: true,
    content_css: '../../../../js/hugerte/skins/content/default/content.css',
    images_upload_url: 'd',
    link_list: [
      { title: 'My page 1', value: 'http://www.hugerte.com' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    image_list: [
      { title: 'My page 1', value: 'http://www.hugerte.com' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    image_class_list: [
      { title: 'None', value: '' },
      { title: 'Some class', value: 'class-name' }
    ],
    plugins: [
      'autosave', 'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
      'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime', 'media', 'nonbreaking',
      'save', 'table', 'directionality', 'emoticons', 'codesample', 'help'
    ]
  };

  hugerte.init(settings);
};
