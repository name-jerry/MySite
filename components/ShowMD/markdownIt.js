import toc from "markdown-it-table-of-contents"
import hljs from 'highlight.js'
import '../../node_modules/highlight.js/styles/github-dark.css';
import MarkdownIt from "markdown-it";
import sub from "markdown-it-sub"
import sup from "markdown-it-sup"
import footnote from "markdown-it-footnote"
import abbr from "markdown-it-abbr"
import emoji from "markdown-it-emoji"
import mark from "markdown-it-mark"
import anchor from "markdown-it-anchor"
import taskLists from "markdown-it-task-lists"
const md = MarkdownIt({
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
					return '<pre class="hljs" lang=' + lang + '><span class="copyBtn" ></span><code>' +
						hljs.highlight(lang, str, true).value +
						'</code></pre>';
				} catch (__) {}
			}
			return ''; // ʹ�ö����Ĭ��ת��
		}
	}).use(sub)
	.use(sup)
	.use(footnote)
	.use(abbr)
	.use(emoji)
	.use(mark)
	.use(anchor, {
		permalink: true,
		permalinkBefore: true,
		permalinkSymbol: '§'
	})
	.use(toc, {
		'includeLevel': [1, 2, 3]
	})
	.use(taskLists);
export default md