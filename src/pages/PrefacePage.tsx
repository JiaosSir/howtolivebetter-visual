import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';
import chaptersData from '../data/chapters.json';
import type { Chapter } from '../types';

const chapters = chaptersData as Chapter[];

const questions: { question: string; chapterId: string }[] = [
  { question: '几乎不花钱，就能明显降低早死概率的事有哪些？', chapterId: 'ch01' },
  { question: '抽烟、喝酒、久坐、熬夜到底折寿多少，怎么戒？', chapterId: 'ch02' },
  { question: '每天精力不够用、总被打断，怎么改？', chapterId: 'ch03' },
  { question: '时间都花哪去了，拖延怎么治？', chapterId: 'ch04' },
  { question: '攒下的钱该怎么放，才不被利息、费率和骗局吃掉？', chapterId: 'ch05' },
  { question: '哪些保健品、体检套餐、智商税可以直接不买？', chapterId: 'ch06' },
  { question: '失业了、被欠薪了、身上没钱了，能领什么？', chapterId: 'ch07' },
  { question: '彩礼、婚前房产、恋爱期间的大额转账算谁的？', chapterId: 'ch08' },
  { question: '哪些「兼职」会让普通人变成刑事被告？', chapterId: 'ch09' },
  { question: '追人该广撒网还是死磕一个，领证要带什么？', chapterId: 'ch10' },
  { question: '写哪些代码、接哪些单会被判刑？', chapterId: 'ch11' },
  { question: '借钱开店、开公司之前最该先想清楚什么？', chapterId: 'ch12' },
  { question: '有人倒地没了呼吸、大出血，先做什么？', chapterId: 'ch13' },
  { question: '账号被盗、手机丢了，第一步做什么？', chapterId: 'ch14' },
  { question: '押金被扣、房东赶人、长租公寓暴雷怎么办？', chapterId: 'ch15' },
  { question: '确诊慢性病之后，长期该怎么管？', chapterId: 'ch16' },
  { question: '老人的监护、遗嘱和钱该怎么提前安排？', chapterId: 'ch17' },
  { question: '生孩子能领什么、要占掉多少时间和钱？', chapterId: 'ch18' },
  { question: '加班费、年休假该怎么算，被裁该拿多少补偿？', chapterId: 'ch19' },
  { question: '孩子刚出生，最要紧的几件事是什么？', chapterId: 'ch20' },
  { question: '哪些国家现在别去，出事了使领馆管到哪一步？', chapterId: 'ch21' },
  { question: '去 KTV、网吧、密室怎么不踩坑？', chapterId: 'ch22' },
  { question: '学电焊、学英语、考证，哪些真的回本？', chapterId: 'ch23' },
  { question: '同一个病在社区看和在三级医院看差多少钱？', chapterId: 'ch24' },
  { question: '家里人走了，当时先做什么？', chapterId: 'ch25' },
  { question: '做个网站或平台收钱，要办哪些证？', chapterId: 'ch26' },
  { question: '怀孕了、要生了，什么时候做什么？', chapterId: 'ch27' },
  { question: '想减肥、想变好看，哪些做法会把身体搞坏？', chapterId: 'ch28' },
  { question: '亲人走了、被裁了、拿到重病诊断，头几个月最要紧的是什么？', chapterId: 'ch29' },
  { question: '孩子上学以后，哪些身体和心理的事不能等到考完再说？', chapterId: 'ch30' },
  { question: '十八岁之后除了读书和打工还有哪几条路？', chapterId: 'ch31' },
  { question: '出国留学，签证身份怎么才算没断？', chapterId: 'ch32' },
  { question: '自己或者家人残疾了，能申请哪些补贴？', chapterId: 'ch33' },
  { question: '感冒药、退烧药，哪些不能一起吃？', chapterId: 'ch34' },
];

const evidenceLevels = [
  {
    level: 'A',
    meaning:
      '有具体数字可查，出处是多项研究合并起来的荟萃分析、跟踪很多人很多年的大型队列，或者随机分组的试验（RCT），能说出降了多少（HR、RR、下降百分比）',
  },
  {
    level: 'B',
    meaning: '有研究支持，但说不出一个确切数字；或者只有小样本、单独一项研究撑着',
  },
  {
    level: 'C',
    meaning: '作者自己的经验，或者大家公认的做法，没有直接的研究文献',
  },
];

const glossary = [
  { term: '总死亡率', definition: '一段时间里，一群人当中死掉的人占多大比例，不管死于什么原因。本书用它衡量「活得久不久」。研究原文里叫全因死亡率，英文缩写 ACM' },
  { term: 'HR', definition: '风险比。同样一段时间里，做了某件事的那组人出事（死亡、得病）的快慢，除以没做的那组。HR 0.87 就是比没做的那组低 13%' },
  { term: 'RR', definition: '相对风险。两组人出事的可能性之比，数字怎么读和 HR 一样' },
  { term: 'OR', definition: '比值比。也是两组的对比，只是算法和 RR 略有不同：要比的那件事很少见时，它和 RR 差不多；很常见时会把差距说得比实际大' },
  { term: '95% CI', definition: '95% 置信区间。研究算出的数字总有误差，这是真实情况很可能落在的范围。范围跨过 1（倍数类）或 0（加减类），说明差别可能只是碰巧' },
  { term: 'RCT', definition: '随机对照试验。用抽签一样的办法把人分成两组，一组做这件事，一组不做，过后比结果差多少。要证明「是这件事起了作用」，这种做法最有说服力' },
  { term: '荟萃分析', definition: '把很多项研究的结果凑到一起重新算，得出一个总的数字。也叫 meta 分析' },
  { term: '队列', definition: '挑一大群人跟踪很多年，记录谁出了事。能看出两件事常一起出现，但不足以证明是前一件造成了后一件' },
  { term: '混杂', definition: '有第三个因素同时牵动着前因和后果，让两件事看起来像有因果。比如爱吃菜的人往往也更爱运动' },
  { term: '反向因果', definition: '因果的方向弄反了：看着像前一件引起后一件，其实是后一件引起前一件。不是睡得多让人早死，而是病重的人睡得多' },
  { term: 'MET', definition: '运动强度的单位。安静坐着是 1 MET，快走约 3 到 4 MET。写成 MET·h，就是强度乘以做了几小时' },
  { term: 'BMI', definition: '体重指数，看胖瘦常用的一个数：体重的公斤数，除以身高米数的平方' },
  { term: 'LDL', definition: '低密度脂蛋白胆固醇，俗称坏胆固醇' },
  { term: 'PM2.5', definition: '飘在空气里的细颗粒物，直径在 2.5 微米以下' },
  { term: 'LPR', definition: '贷款市场报价利率。国内贷款利率的基准，每月 20 日公布一次' },
  { term: 'AED', definition: '自动体外除颤器。公共场所常见的红色或黄色急救箱，开机以后跟着语音提示做就行' },
  { term: 'CPR', definition: '心肺复苏。心脏骤停时用力按压胸口，让血继续流动' },
];

const fourResources = [
  { name: '寿命', description: '活得更久，少死于本来可以避免的事' },
  { name: '时间与精力', description: '活着的时间不花在没有回报的事上，每天的注意力和体力少被白白耗掉' },
  { name: '金钱', description: '少花冤枉钱，把钱花在收益确定的地方' },
  { name: '人身自由', description: '不因为不知道一条红线，把自己送进拘留所或者看守所' },
];

export default function PrefacePage() {
  return (
    <div>
      <FadeIn>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#32adfe]/10 dark:bg-[#30aefc]/10 border border-[#32adfe]/20 dark:border-[#30aefc]/20 text-[#32adfe] dark:text-[#30aefc] text-xs font-medium mb-4">
            前言
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#32adfe] dark:text-[#30aefc] mb-4">
            高性价比人生指南
          </h1>
          <p className="text-slate-700 dark:text-neutral-400 text-sm leading-relaxed">
            讲怎么活得久、怎么少生病，出了意外怎么救。讲怎么少花冤枉钱，哪些事会让人被骗、摊上官司。讲没工作没钱时能去领什么，开店、开公司、做网站要办什么手续。也讲恋爱结婚生孩子、出国和学手艺。765
            条建议，每条写明花掉什么、换回什么、证据有多硬。不用全做——挑走一两条就算数。
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={50}>
        <section className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#32adfe] dark:text-[#30aefc] mb-4">
            这本书想回答的问题
          </h2>
          <div className="divide-y divide-slate-200 dark:divide-neutral-800">
            {questions.map(({ question, chapterId }) => {
              const chapter = chapters.find((ch) => ch.id === chapterId);
              return (
                <div
                  key={chapterId}
                  className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-neutral-500">
                    {chapter?.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-neutral-400">{question}</p>
                  </div>
                  <Link
                    to={`/chapter/${chapterId}`}
                    className="flex-shrink-0 text-xs text-[#32adfe] dark:text-[#30aefc] hover:text-[#1a9ae8] dark:hover:text-[#30aefc] transition-colors"
                  >
                    查看 →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={100}>
        <section className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#32adfe] dark:text-[#30aefc] mb-4">怎么读</h2>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-neutral-400 leading-relaxed">
            <li>
              <strong className="text-blue-900 dark:text-white">不用全做：</strong>
              这是一份备选单，不是任务清单。挑走一两条就算数，剩下的放着，需要时再回来查。
            </li>
            <li>
              <strong className="text-blue-900 dark:text-white">看不懂那串数字：</strong>
              每条都有一行「说人话」。它把研究里的写法翻成日常说法。只看这一行就够拿主意。
            </li>
            <li>
              <strong className="text-blue-900 dark:text-white">只想看结论最硬的：</strong>
              证据等级 A，只留下有具体数字、来自荟萃分析或大型试验的 495 条。
            </li>
            <li>
              <strong className="text-blue-900 dark:text-white">只想看最值得做的：</strong>
              性价比「极高」，得到 122 条不花钱、用时少、不需要毅力，收益又落在最大一档的条目。
            </li>
            <li>
              <strong className="text-blue-900 dark:text-white">看到「不要」开头的节标题不用紧张：</strong>
              节标题说的是这一节想防住的事，不是说底下每条都在让你别干什么。真正要做的动作写在条目标题里。
            </li>
          </ul>
        </section>
      </FadeIn>

      <FadeIn delay={150}>
        <section className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#32adfe] dark:text-[#30aefc] mb-4">
            四种资源
          </h2>
          <p className="text-sm text-slate-700 dark:text-neutral-400 mb-4">
            这本书想帮你多留住的不只是寿命，一共四样东西：
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {fourResources.map((r) => (
              <div
                key={r.name}
                className="rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800 p-4"
              >
                <h3 className="text-sm font-semibold text-blue-900 dark:text-white mb-1">
                  {r.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-neutral-500">{r.description}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={200}>
        <section className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#32adfe] dark:text-[#30aefc] mb-4">
            证据分级
          </h2>
          <p className="text-sm text-slate-700 dark:text-neutral-400 mb-4">每条建议都标注证据等级：</p>
          <div className="space-y-3">
            {evidenceLevels.map(({ level, meaning }) => (
              <div
                key={level}
                className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800 p-4"
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    level === 'A'
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-[#30aefc]'
                      : level === 'B'
                        ? 'bg-amber-500/20 text-amber-700 dark:text-[#30aefc]'
                        : 'bg-slate-500/20 text-slate-700 dark:text-neutral-500'
                  }`}
                >
                  {level}
                </span>
                <p className="text-sm text-slate-700 dark:text-neutral-400 pt-1">{meaning}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 dark:text-neutral-500 mt-4">
            全书 765 条中 A 级 495 条、B 级 218 条、C 级 52 条。A
            级只说明「有具体数字、出处可核」，不说明这个数字一定是因果。
          </p>
        </section>
      </FadeIn>

      <FadeIn delay={250}>
        <section className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <h2 className="text-lg font-semibold text-[#32adfe] dark:text-[#30aefc] mb-4">
            读懂数字（术语表）
          </h2>
          <p className="text-sm text-slate-700 dark:text-neutral-400 mb-4">
            正文尽量用日常说法，但引用研究的时候免不了出现几个统计名词。看不懂就查这张表。
          </p>
          <div className="divide-y divide-slate-200 dark:divide-neutral-800">
            {glossary.map(({ term, definition }) => (
              <div key={term} className="py-3 first:pt-0 last:pb-0">
                <dt className="text-sm font-semibold text-[#32adfe] dark:text-[#30aefc]">
                  {term}
                </dt>
                <dd className="text-xs text-slate-600 dark:text-neutral-500 mt-1 leading-relaxed">
                  {definition}
                </dd>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
