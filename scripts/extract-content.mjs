import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const EPUB_DIR = join(process.cwd(), 'epub_extracted', 'OEBPS');
const OUTPUT_DIR = join(process.cwd(), 'src', 'data');

function stripTags(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function extractItems(html, chapterId) {
  const items = [];
  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/g;
  let h3Match;
  const h3Positions = [];

  while ((h3Match = h3Regex.exec(html)) !== null) {
    h3Positions.push({
      index: h3Match.index,
      title: stripTags(h3Match[1]).replace(/^\d+\.\s*/, ''),
      end: h3Match.index + h3Match[0].length,
    });
  }

  for (let i = 0; i < h3Positions.length; i++) {
    const start = h3Positions[i].end;
    const end = i + 1 < h3Positions.length ? h3Positions[i + 1].index : html.length;
    const section = html.substring(start, end);

    const titleMatch = section.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
    const fullTitle = titleMatch ? stripTags(titleMatch[1]) : h3Positions[i].title;
    const numberMatch = fullTitle.match(/^(\d+)\.\s*(.+)/);
    const number = numberMatch ? parseInt(numberMatch[1]) : i + 1;
    const title = numberMatch ? numberMatch[2] : fullTitle;

    const liRegex = /<li>([\s\S]*?)<\/li>/g;
    let liMatch;
    const fields = {};

    while ((liMatch = liRegex.exec(section)) !== null) {
      const content = liMatch[1];
      const textContent = stripTags(content);

      if (textContent.startsWith('成本：')) {
        fields.cost = textContent.replace('成本：', '').trim();
      } else if (textContent.startsWith('说人话：')) {
        fields.plainLanguage = textContent.replace('说人话：', '').trim();
      } else if (textContent.startsWith('收益：')) {
        fields.benefit = textContent.replace('收益：', '').trim();
      } else if (textContent.startsWith('证据等级：')) {
        const level = textContent.replace('证据等级：', '').trim();
        if (['A', 'B', 'C'].includes(level)) {
          fields.evidenceLevel = level;
        }
      } else if (textContent.startsWith('来源：')) {
        fields.source = textContent.replace('来源：', '').trim();
      } else if (textContent.startsWith('备注：')) {
        fields.note = textContent.replace('备注：', '').trim();
      }
    }

    items.push({
      id: `${chapterId}-${number}`,
      chapterId,
      number,
      title,
      cost: fields.cost || '',
      plainLanguage: fields.plainLanguage || '',
      benefit: fields.benefit || '',
      evidenceLevel: fields.evidenceLevel || 'C',
      source: fields.source || '',
      note: fields.note || '',
    });
  }

  return items;
}

function extractChapterInfo(html) {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!h1Match) return { number: 0, title: '', subtitle: '' };

  const fullTitle = stripTags(h1Match[1]);
  const numMatch = fullTitle.match(/^(\d+)\.\s*(.+)/);
  return {
    number: numMatch ? parseInt(numMatch[1]) : 0,
    title: numMatch ? numMatch[2] : fullTitle,
    subtitle: '',
  };
}

function processChapterFile(filename) {
  const filepath = join(EPUB_DIR, filename);
  const html = readFileSync(filepath, 'utf-8');
  const chapterId = basename(filename, '.xhtml');
  const info = extractChapterInfo(html);
  const items = extractItems(html, chapterId);

  const chapterDescriptions = {
    ch01: '外因死亡、燃气与中毒、疫苗、筛查、心理危机与自杀念头',
    ch02: '烟酒、运动、睡眠、饮食、久坐',
    ch03: '睡眠、打断、多任务、人际负债',
    ch04: '无收益项目、沉没成本、拖延、会议、通勤',
    ch05: '订阅、彩票、利息与借钱、保险、基金费率',
    ch06: '看起来性价比高但其实不高的东西',
    ch07: '救助、补贴、找活、住宿吃饭、医疗、欠薪维权',
    ch08: '交通事故、被骗止付、自首、冲突与泄愤、彩礼、婚前财产',
    ch09: '谣言、侮辱英烈、境外内容、传播色情、兼职洗钱',
    ch10: '择偶策略、异地恋、登记流程、婚检、健康账、时间账、钱账',
    ch11: '外挂、爬虫、抢票脚本、删库、带走源码、竞业、开源许可',
    ch12: '本钱、担保、主体选择、注册登记、许可证、纳税申报',
    ch13: '心脏骤停、卒中、心梗、大出血、火灾、溺水、迷路',
    ch14: '二次验证、密码、SIM卡、手机丢失、银行卡盗刷',
    ch15: '押金、暴力腾退、中介代收、资金监管、买卖不破租赁',
    ch16: '服药依从、门诊慢特病、复查记录、并发症筛查',
    ch17: '意定监护、遗嘱、投资养老骗局、长期护理保险',
    ch18: '育儿补贴、产假与生育津贴、时间账、钱账',
    ch19: '加班费、年休假、试用期、工伤认定、离职补偿',
    ch20: '安全睡眠、乙肝首针、免疫规划疫苗、母乳与辅食',
    ch21: '安全提醒、12308、领事保护、境外医疗保险',
    ch22: '安全出口、明码标价、涉毒红线、运动、正念、呼吸',
    ch23: '读书还是打工、教育回报率、山寨证书、培训补贴',
    ch24: '分级诊疗与转诊、报销比例、病历留存、急诊分诊',
    ch25: '报警与死亡证明、遗体接运与火化、注销户口',
    ch26: '支付结算红线、ICP许可与备案、平台核验',
    ch27: '叶酸、建册与免费产检、三病筛查、孕期烟酒',
    ch28: '极端节食、医美机构、减肥产品、合成代谢类固醇',
    ch29: '丧亲、重病诊断、失业、丧偶、哀伤',
    ch30: '被欺凌、每天户外2小时、学生体检、青少年抑郁筛查',
    ch31: '当兵、基层服务项目、特岗教师、消防员、自考',
    ch32: '认证院校名单、打工时数、签证身份、留服认证',
    ch33: '脊髓损伤、精神障碍住院、轮椅减压、残疾人证',
    ch34: '对乙酰氨基酚、孩子退烧、布洛芬、感冒药、抗生素',
  };

  return {
    id: chapterId,
    number: info.number,
    title: info.title,
    subtitle: chapterDescriptions[chapterId] || '',
    description: '',
    items,
  };
}

function processDocFile(filename) {
  const filepath = join(EPUB_DIR, filename);
  const html = readFileSync(filepath, 'utf-8');
  const docId = basename(filename, '.xhtml');

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const title = h1Match ? stripTags(h1Match[1]) : docId;

  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
  const sections = [];
  let h2Match;
  const h2Positions = [];

  while ((h2Match = h2Regex.exec(html)) !== null) {
    h2Positions.push({
      title: stripTags(h2Match[1]),
      end: h2Match.index + h2Match[0].length,
    });
  }

  for (let i = 0; i < h2Positions.length; i++) {
    const start = h2Positions[i].end;
    const end = i + 1 < h2Positions.length ? html.indexOf('<h2', h2Positions[i].end) : html.indexOf('</section>');
    const sectionHtml = end > start ? html.substring(start, end) : '';
    const content = stripTags(sectionHtml).replace(/\s+/g, ' ').trim();

    if (content) {
      sections.push({
        title: h2Positions[i].title,
        content,
      });
    }
  }

  return { id: docId, title, sections };
}

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const chapterFiles = readdirSync(EPUB_DIR)
    .filter(f => /^ch\d+\.xhtml$/.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });

  const chapters = chapterFiles.map(processChapterFile);
  writeFileSync(
    join(OUTPUT_DIR, 'chapters.json'),
    JSON.stringify(chapters, null, 2),
    'utf-8'
  );
  console.log(`Extracted ${chapters.length} chapters`);

  const docFiles = readdirSync(EPUB_DIR)
    .filter(f => /^doc\d+\.xhtml$/.test(f))
    .sort();

  const docs = docFiles.map(processDocFile);
  writeFileSync(
    join(OUTPUT_DIR, 'docs.json'),
    JSON.stringify(docs, null, 2),
    'utf-8'
  );
  console.log(`Extracted ${docs.length} docs`);

  const totalItems = chapters.reduce((sum, ch) => sum + ch.items.length, 0);
  console.log(`Total items: ${totalItems}`);

  chapters.forEach(ch => {
    console.log(`  ${ch.id}: ${ch.title} (${ch.items.length} items)`);
  });
}

main();
