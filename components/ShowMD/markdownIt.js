import "../../node_modules/markdown-it/dist/markdown-it.min.js"
import "../../node_modules/markdown-it-sub/dist/markdown-it-sub.min.js"
import "../../node_modules/markdown-it-sup/dist/markdown-it-sup.min.js"
import "../../node_modules/markdown-it-footnote/dist/markdown-it-footnote.min.js"
import "../../node_modules/markdown-it-abbr/dist/markdown-it-abbr.min.js"
import "../../node_modules/markdown-it-emoji/dist/markdown-it-emoji.min.js"
import "../../node_modules/markdown-it-mark/dist/markdown-it-mark.min.js"
import "../../node_modules/markdown-it-anchor/dist/markdownItAnchor.umd.js"
import "../../node_modules/markdown-it-task-lists/dist/markdown-it-task-lists.min.js"
import toc from "markdown-it-table-of-contents"
import hljs from 'highlight.js'
import '../../node_modules/highlight.js/styles/github-dark.css';


const md = window.markdownit({
    html: true, // ��Դ�������� HTML ��ǩ
    xhtmlOut: true, // ʹ�� '/' ���պϵ���ǩ ������ <br />����
    // ���ѡ��ֻ����ȫ�� CommonMark ģʽ���ݡ�
    breaks: false, // ת��������� '\n' �� <br>��
    langPrefix: 'language-', // ��Χ�������� CSS ����ǰ׺�����ڶ���ĸ�������ǳ����á�
    linkify: false, // ������ URL ���ı��Զ�ת��Ϊ���ӡ�
    // ����һЩ�����������滻 + ��������
    typographer: false,
    // ˫ + �������滻�ԣ��� typographer ����ʱ��
    // �����������ŵȣ������� String �� Array��
    // �ȷ�˵�������֧�� '��' ������˹��ʹ�ã� '����'  ���¹���ʹ�á�
    // ���� ['\xA0', '\xA0', '\xA0', '\xA0'] ��������ʹ�ã����� nbsp����
    quotes: "",
    // �����������᷵��ת���HTML��
    // �� '' ���Դ�ַ���δ���ģ���Ӧ���ⲿ����ת�塣
    // �������� <pre ... ��ͷ���ڲ���װ�����������
    highlight: function(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          // return hljs.highlight(str + '<span>' + lang + '</span>', { language: lang }).value;
          return '<pre class="hljs" lang=' + lang + '><span id="copyBtn"></span><code>' +
            hljs.highlight(lang, str, true).value +
            '</code></pre>';
        } catch (__) {}
      }

      return ''; // ʹ�ö����Ĭ��ת��
    }
  }).use(window.markdownitSub)
  .use(window.markdownitSup)
  .use(window.markdownitFootnote)
  .use(window.markdownitAbbr)
  .use(window.markdownitEmoji)
  .use(window.markdownitMark)
  .use(window.markdownItAnchor, { permalink: true, permalinkBefore: true, permalinkSymbol: '§' })
  .use(toc, { 'includeLevel': [1, 2, 3, 4, 5, 6] })
  .use(window.markdownitTaskLists);
export default md
