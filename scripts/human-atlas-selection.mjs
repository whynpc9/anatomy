// Curated BodyParts3D selections. Names/FMA membership are pinned to the source
// revision recorded by import-human-atlas.mjs, not its display-system labels.
// Hotspots name actual source meshes; the importer places them on their surfaces.
const spot = (mesh, label, detail) => ({ mesh, label, detail });
const entry = (id, name, scientificName, system, accent, concepts, content, hotspots, extra = {}) => ({
  id, name, scientificName, system, accent, concepts, ...content, hotspots, ...extra,
});
const neuro = '神经系统', vascular = '心血管系统', digestive = '消化系统';
const muscle = '肌肉系统', sensory = '感觉系统', reproductive = '生殖系统';

export const selections = [
  entry('pineal-gland', '松果体', 'Pineal gland', '内分泌系统', '#b98da6', ['FMA62033'], {
    description: '位于间脑后部的小型内分泌腺，分泌褪黑素，参与传递昼夜节律信号。',
    poetic: '感知昼夜的腺体', size: '毫米级的小腺体', weight: '个体差异明显，模型不用于称重',
    location: '第三脑室后上方、上丘附近', function: '通过褪黑素参与昼夜节律调节',
    dailyFact: '褪黑素分泌通常在夜间较高。', medical: '这是外形模型，不区分腺细胞或钙化灶。',
    bloodSupply: '主要来自大脑后动脉的脉络膜后支', funFact: '松果体的名字来自它与小松果相似的外形。',
  }, [spot('FJ1795', '松果体', '腺体外形；微观细胞结构未在模型中呈现')]),
  entry('hippocampus', '海马', 'Hippocampus', neuro, '#c48b96', ['FMA62493'], {
    description: '颞叶内侧的成对脑结构，参与新记忆的形成和空间信息处理。',
    poetic: '记忆与空间定位', size: '沿颞叶内侧弯曲延伸', weight: '不单列重量',
    location: '两侧颞叶内侧，邻近侧脑室下角', function: '参与情景记忆的形成与巩固',
    dailyFact: '海马与周围皮层共同参与记忆网络。', medical: '模型呈现整体外形，不区分海马各细胞层。',
    bloodSupply: '大脑后动脉分支及脉络膜前动脉', funFact: '海马的弯曲形态让早期解剖学家联想到海中的海马。',
  }, [spot('FJ1759', '左海马', '左侧颞叶内侧的记忆相关结构'), spot('FJ1807', '右海马', '右侧海马，与左侧共同参与记忆和空间处理')]),
  entry('amygdala', '杏仁核', 'Amygdala', neuro, '#c18d87', ['FMA61841'], {
    description: '颞叶内侧的一组神经核团，参与情绪意义评估、学习和自主神经反应。',
    poetic: '评估经历的意义', size: '小型成对核团复合体', weight: '不单列重量',
    location: '颞叶内侧、海马前方附近', function: '整合情绪相关信号并影响学习和行为',
    dailyFact: '杏仁核的作用不限于恐惧，也参与其他情绪和奖赏学习。', medical: '此模型未细分基底外侧核群与中央核等内部核团。',
    bloodSupply: '脉络膜前动脉及大脑中、后动脉的分支', funFact: '“杏仁”描述的是外形，而非它只负责一种情绪。',
  }, [spot('FJ1753', '左杏仁核', '左侧杏仁核复合体'), spot('FJ1829', '右杏仁核', '右侧杏仁核复合体')]),
  entry('thalamus', '丘脑', 'Thalamus', neuro, '#b59cbd', ['FMA62007'], {
    description: '位于间脑的成对灰质结构，在感觉、运动及认知网络中承担信息中继与调节。',
    poetic: '通往皮层的中继', size: '成对的卵圆形结构', weight: '不单列重量',
    location: '第三脑室两侧、脑干上方', function: '调节传向大脑皮层的多类信息',
    dailyFact: '多数感觉信息到达皮层前会经过丘脑中继。', medical: '整体外形不等于内部各丘脑核团的边界。',
    bloodSupply: '大脑后动脉及后交通动脉分支', funFact: '丘脑既接收来自下方的信号，也接收大量皮层反馈。',
  }, [spot('FJ1782', '左丘脑', '第三脑室左侧的丘脑'), spot('FJ1827', '右丘脑', '第三脑室右侧的丘脑')]),
  entry('hypothalamus', '下丘脑', 'Hypothalamus', neuro, '#bc8c9b', ['FMA62008'], {
    description: '位于丘脑下方，连接自主神经与内分泌调节，参与体温、摄食、口渴和节律控制。',
    poetic: '维持内部稳态', size: '间脑腹侧的小片区域', weight: '不单列重量',
    location: '第三脑室下部两侧及底部', function: '协调体内稳态并调节垂体活动',
    dailyFact: '口渴和体温调节都涉及下丘脑网络。', medical: '本模型包含下丘脑与灰结节外形，未细分各功能核团。',
    bloodSupply: '大脑动脉环附近的小穿支', funFact: '下丘脑虽小，却与神经、激素和行为调节都有联系。',
  }, [spot('FJ1760', '下丘脑组织', '下丘脑的一侧网格；不代表单个功能核'), spot('FJ1780', '灰结节', '下丘脑底部的结构，邻近漏斗部')]),
  entry('corpus-callosum', '胼胝体', 'Corpus callosum', neuro, '#c4aa9c', ['FMA86464'], {
    description: '连接左右大脑半球的主要连合纤维束，使两侧皮层能够交换信息。',
    poetic: '连接两侧半球', size: '沿大脑中线呈弓形延伸', weight: '不单列重量',
    location: '大脑纵裂深部、侧脑室上方', function: '传递左右大脑半球之间的信息',
    dailyFact: '胼胝体由大量有髓神经纤维组成。', medical: '外形网格不显示单条纤维的走向或连接目标。',
    bloodSupply: '主要为大脑前动脉分支，后部也接受大脑后动脉分支', funFact: '从侧面观察，它呈现一条弯曲的白质弓。',
  }, [spot('FJ1742', '胼胝体', '连接左右半球的连合白质；模型为整体外形')]),
  entry('brain-ventricles', '脑室系统', 'Cerebral ventricular system', neuro, '#7fabb8', ['FMA242787'], {
    description: '由侧脑室、第三脑室、脑导水管和第四脑室组成的相通腔隙。本模型用实体表面表示腔隙形状。',
    poetic: '脑内的液体通路', size: '跨越大脑与脑干的腔隙系统', weight: '腔隙不以组织重量描述',
    location: '大脑半球、间脑及脑干背侧内部', function: '容纳并输送脑脊液',
    dailyFact: '脑脊液还会流向脑和脊髓周围的蛛网膜下腔。', medical: '模型不是脑组织块，也不显示脑脊液流速。',
    bloodSupply: '相关脉络丛由脉络膜动脉等供血', funFact: '左右侧脑室分别经室间孔与第三脑室相通。',
  }, [spot('FJ1767', '左侧脑室', '位于左大脑半球内的腔隙'), spot('FJ1814', '右侧脑室', '位于右大脑半球内的腔隙'), spot('FJ1730', '第三脑室', '位于间脑中线'), spot('FJ1738', '脑导水管', '连接第三与第四脑室'), spot('FJ1731', '第四脑室', '位于脑干与小脑之间')]),
  entry('aorta', '主动脉', 'Aorta', vascular, '#cf7868', ['FMA3734'], {
    description: '体循环的动脉主干，从左心室发出，经胸部下降进入腹部；本条目突出主干而非全部分支。',
    poetic: '体循环的主干', size: '从胸腔延伸至腹部', weight: '血管不单列重量',
    location: '自心脏基底向上弯曲，再沿脊柱前方下降', function: '将左心室泵出的血液送往体循环各分支',
    dailyFact: '主动脉壁的弹性有助于缓冲每次心搏的压力变化。', medical: '本模型不用于测量管径或判断动脉瘤。',
    bloodSupply: '管壁外层由滋养血管供血，内层依赖腔内扩散', funFact: '主动脉弓让血流从向上转为向下，继续通向躯干和下肢。',
  }, [spot('FJ3413', '升主动脉', '主动脉自心脏发出的上行段'), spot('FJ3411', '主动脉弓', '连接升段与降段'), spot('FJ1931', '胸主动脉', '胸腔中的下降段'), spot('FJ1932', '腹主动脉', '进入腹腔后的主干')]),
  entry('superior-vena-cava', '上腔静脉', 'Superior vena cava', vascular, '#7e99bb', ['FMA4720'], {
    description: '汇集头颈、上肢及部分胸部的静脉血，回流至右心房。此处展示上腔静脉主干。',
    poetic: '上半身的回流', size: '胸腔内较短的静脉主干', weight: '血管不单列重量',
    location: '上纵隔右侧，通向右心房', function: '将上半身的静脉血送回心脏',
    dailyFact: '左右头臂静脉汇合形成上腔静脉。', medical: '模型未包括全部属支或周围纵隔结构。',
    bloodSupply: '管壁由滋养血管与腔内扩散支持', funFact: '它与下腔静脉分别承担不同区域的主要静脉回流。',
  }, [spot('FJ3645', '上腔静脉主干', '将血液导向右心房的短主干')]),
  entry('inferior-vena-cava', '下腔静脉', 'Inferior vena cava', vascular, '#819db9', ['FMA10951'], {
    description: '收集下肢、盆腔和腹部多处结构的静脉血，穿过膈肌后进入右心房。',
    poetic: '下半身的回流', size: '沿腹部向胸腔上行', weight: '血管不单列重量',
    location: '腹主动脉右侧，肝后方经过膈肌', function: '将下半身的静脉血送回心脏',
    dailyFact: '消化道的许多静脉先经肝门静脉入肝，再由肝静脉回流。', medical: '本条目仅呈现源数据中的主干分段。',
    bloodSupply: '管壁由滋养血管与腔内扩散支持', funFact: '下腔静脉有专门穿过膈肌的腔静脉孔。',
  }, [spot('FJ3441', '下腔静脉分段', '沿腹部上行的主干网格'), spot('FJ3659', '下腔静脉另一分段', '保留源模型主干各段的相对位置')]),
  entry('hepatic-portal-vein', '肝门静脉', 'Hepatic portal vein', vascular, '#879bb6', ['FMA45847'], {
    description: '将消化道等区域的静脉血引入肝脏。本模型突出肝门静脉及其肝内分支。',
    poetic: '进入肝脏的静脉', size: '腹部主干与肝内分支网络', weight: '血管不单列重量',
    location: '由肝门进入肝内并分为左右分支', function: '把吸收的营养物质等带入肝脏处理',
    dailyFact: '肝脏同时接受门静脉和肝动脉的血液。', medical: '模型不是完整消化道静脉图，不表示门静脉压力。',
    bloodSupply: '管腔输送门静脉血；管壁由微循环支持', funFact: '“门”指肝门，即血管和胆管进出肝脏的区域。',
  }, [spot('FJ3082', '肝前门静脉', '进入肝脏之前的门静脉段'), spot('FJ3102', '左门静脉主干', '通向肝左侧的门静脉分支'), spot('FJ3122', '右门静脉主干', '通向肝右侧的门静脉分支')]),
  entry('biliary-tree', '胆道系统', 'Biliary tree', digestive, '#9eac74', ['FMA14665', 'FMA71856'], {
    description: '呈现肝内胆管分支、左右肝管、肝总管与胆囊管。源数据未单独提供完整胆总管，不能视为完整胆道。',
    poetic: '胆汁的汇流路径', size: '肝内分支汇入肝外管道', weight: '管道不单列重量',
    location: '肝实质内部及肝门附近', function: '收集并传输肝脏产生的胆汁',
    dailyFact: '胆汁由肝脏产生，胆囊负责储存和浓缩。', medical: '模型未显示完整胆总管及十二指肠乳头区域。',
    bloodSupply: '主要由肝动脉系统的胆管周围血管网供血', funFact: '肝内的小胆管像树枝一样逐级汇合。',
  }, [spot('FJ3096', '左肝管', '汇集肝左侧胆汁'), spot('FJ3123', '右肝管', '汇集肝右侧胆汁'), spot('FJ3079', '肝总管', '左右肝管汇合后的管道'), spot('FJ3080', '胆囊管', '连接胆囊与肝外胆道')]),
  entry('pancreatic-ducts', '胰管系统', 'Pancreatic duct system', digestive, '#d0a17d', ['FMA63103'], {
    description: '胰腺的导管网络，收集外分泌部产生的胰液并向十二指肠输送。',
    poetic: '汇集消化液', size: '沿胰腺长轴延伸的导管', weight: '管道不单列重量',
    location: '胰腺内部，从尾部方向通向头部', function: '传输含消化酶和碳酸氢盐的胰液',
    dailyFact: '胰管输送的是外分泌液，胰岛激素则直接进入血液。', medical: '源模型未单独标识副胰管，不代表所有导管变异。',
    bloodSupply: '邻近胰腺由脾动脉及胰十二指肠动脉分支供血', funFact: '胰腺兼有导管分泌和激素分泌两种工作方式。',
  }, [spot('FJ1896', '胰管', '源模型标识的胰管段'), spot('FJ2630', '胰管树', '源模型保留的导管分支')]),
  entry('mesentery', '肠系膜', 'Mesentery', digestive, '#c7a18b', ['FMA20570'], {
    description: '腹膜形成的系膜将部分肠道连接于腹壁，并为血管、神经和淋巴管提供通路。此处展示三处系膜。',
    poetic: '悬系与通路', size: '随所连接的肠段而异', weight: '不单列重量',
    location: '腹腔内，肠管与腹壁之间', function: '支持肠段并容纳血管、神经与淋巴通路',
    dailyFact: '小肠系膜可在提供支持的同时允许肠袢活动。', medical: '模型仅包含小肠系膜、阑尾系膜和横结肠系膜。',
    bloodSupply: '相应肠系膜动脉分支', funFact: '“系膜”既是连接结构，也是进入肠壁的通路。',
  }, [spot('FJ3396', '小肠系膜', '连接空肠和回肠相关肠袢'), spot('FJ3397', '阑尾系膜', '与阑尾相连的小片系膜'), spot('FJ3398', '横结肠系膜', '支持横结肠的系膜')]),
  entry('seminal-vesicles', '精囊（男性参考）', 'Seminal vesicles', reproductive, '#c89b8e', ['FMA19386'], {
    description: '膀胱后方的成对附属生殖腺，分泌构成精液一部分的液体。',
    poetic: '成对的附属腺', size: '卷曲管状的腺体', weight: '不单列重量',
    location: '膀胱后方、前列腺上方附近', function: '分泌含果糖等成分的液体',
    dailyFact: '精囊的主要功能是分泌液体，而非储存精子。', medical: '模型为成年男性参考，仅展示外部轮廓。',
    bloodSupply: '膀胱下动脉、直肠中动脉等分支', funFact: '精囊与输精管末端相邻，导管汇合形成射精管。',
  }, [spot('FJ3137', '左精囊', '左侧附属生殖腺'), spot('FJ3143', '右精囊', '右侧附属生殖腺')]),
  entry('ductus-deferens', '输精管（男性参考）', 'Ductus deferens', reproductive, '#bfa188', ['FMA19234'], {
    description: '连接附睾与盆腔内射精管形成部位的成对肌性管道，参与输送精子。',
    poetic: '细长的肌性管道', size: '长而细的成对管道', weight: '管道不单列重量',
    location: '自附睾经精索、腹股沟管进入盆腔', function: '通过管壁收缩输送精子',
    dailyFact: '输精管进入盆腔后走向膀胱后方。', medical: '本模型为男性参考，不显示管壁的显微层次。',
    bloodSupply: '输精管动脉及邻近动脉吻合支', funFact: '输精管虽细，却有较厚的平滑肌壁。',
  }, [spot('FJ3135', '左输精管', '左侧管道的空间行程'), spot('FJ3140', '右输精管', '右侧管道的空间行程')]),
  entry('lacrimal-apparatus', '泪器', 'Lacrimal apparatus', sensory, '#9bb6bc', ['FMA59368', 'FMA59369'], {
    description: '包括泪腺及泪液引流结构；泪液润滑眼表后，经泪小管、泪囊和鼻泪管排出。',
    poetic: '眼表的润滑与引流', size: '分布在眼眶周围的小型结构', weight: '不单列重量',
    location: '泪腺位于眼眶外上方，引流道位于内侧', function: '分泌并引流泪液',
    dailyFact: '鼻泪管将泪液引向鼻腔。', medical: '泪湖网格表示泪液聚集区域，不是一块实质组织。',
    bloodSupply: '眼动脉及面动脉等分支', funFact: '流泪时鼻子也会湿润，与眼和鼻之间的引流通道有关。',
  }, [spot('FJ1299', '左泪腺', '位于眼眶外上方的分泌结构'), spot('FJ1350', '右泪腺', '右侧泪液分泌结构'), spot('FJ1309', '左泪囊', '承接泪小管引流'), spot('FJ1302', '左鼻泪管', '由泪囊向鼻腔延伸')]),
  entry('extraocular-muscles', '眼外肌', 'Extraocular muscles', sensory, '#c58c7c', ['FMA49033'], {
    description: '每侧六条眼球运动肌控制注视方向；模型还保留两侧提上睑肌，便于观察上睑运动结构。',
    poetic: '协调注视方向', size: '围绕眼球排列的短小肌群', weight: '不单列重量',
    location: '左右眼眶内', function: '协调眼球运动；提上睑肌负责上提上睑',
    dailyFact: '眼球运动依赖两眼肌群的精细配合。', medical: '每侧七个网格包含六条眼球运动肌和一条提上睑肌。',
    bloodSupply: '眼动脉的肌支等', funFact: '直肌和斜肌的名称描述了它们不同的走向。',
  }, [spot('FJ1304', '左外直肌', '使眼球向外转动'), spot('FJ1308', '左内直肌', '使眼球向内转动'), spot('FJ1322', '左上斜肌', '参与复合眼球运动'), spot('FJ1306', '左提上睑肌', '上提上睑，不计入六条眼球运动肌')]),
  entry('hyoid', '舌骨', 'Hyoid bone', '骨骼系统', '#bca88a', ['FMA52749'], {
    description: '颈前部的小型骨，为舌及多条颈部肌肉提供附着，与吞咽和发声运动有关。',
    poetic: '颈前的悬骨', size: '小型马蹄形骨', weight: '不单列重量',
    location: '下颌骨下方、喉上方', function: '支持舌并作为舌骨上、下肌群的附着点',
    dailyFact: '舌骨通过肌肉和韧带悬系。', medical: '源数据的两个网格共同保留，本模型未包含周围肌肉。',
    bloodSupply: '邻近舌动脉、甲状腺上动脉等分支', funFact: '舌骨不与其他骨形成直接的骨性关节。',
  }, [spot('FJ2772', '舌骨网格', '源模型中的舌骨组成部分'), spot('FJ3201', '舌骨另一网格', '保留原始相对位置，不将网格数当作骨数')]),
  entry('achilles-tendons', '跟腱', 'Calcaneal tendons', '运动系统', '#bba991', ['FMA51061'], {
    description: '连接小腿后方肌群与跟骨的强韧肌腱，把肌肉产生的拉力传递至足跟。',
    poetic: '传递蹬地力量', size: '小腿后下方的成对肌腱', weight: '不单列重量',
    location: '踝后方，连接至跟骨后面', function: '传递跖屈力量，参与行走与蹬地',
    dailyFact: '跟腱主要汇集腓肠肌和比目鱼肌的力量。', medical: '模型只显示肌腱外形，不表示受力或损伤状态。',
    bloodSupply: '胫后动脉和腓动脉等的周围分支', funFact: '提踵时，跟腱把小腿肌肉收缩传递到足部。',
  }, [spot('FJ1405', '右跟腱', '右侧小腿肌群至跟骨的传力结构'), spot('FJ1405M', '左跟腱', '左侧跟腱')]),
  entry('intercostal-muscles', '肋间肌', 'Intercostal muscles', muscle, '#bc8a78', ['FMA13354'], {
    description: '位于肋间隙的分层肌群，包括肋间外肌、肋间内肌和肋间最内肌，参与胸壁稳定及呼吸运动。',
    poetic: '随呼吸运动的胸壁', size: '分布于胸廓两侧的肋间隙', weight: '肌群不单列重量',
    location: '相邻肋骨之间', function: '稳定肋间隙并辅助改变胸廓容积',
    dailyFact: '不同层次的肋间肌具有不同纤维走向。', medical: '模型按层和侧分组，不是每个肋间隙一个网格。',
    bloodSupply: '肋间前、后动脉', funFact: '安静呼吸和用力呼吸对胸壁肌群的动员程度不同。',
  }, [spot('FJ1451', '肋间外肌层', '外层肋间肌网格'), spot('FJ1455', '肋间内肌层', '内层肋间肌网格'), spot('FJ1454', '肋间最内肌层', '较深层的肋间肌网格')]),
  entry('quadriceps', '股四头肌', 'Quadriceps femoris', muscle, '#c38b78', ['FMA22429'], {
    description: '大腿前方的肌群，由股直肌、股外侧肌、股内侧肌和股中间肌组成，主要负责伸膝。',
    poetic: '大腿前方的伸膝肌', size: '覆盖大腿前方的大型肌群', weight: '随体型与训练状态变化',
    location: '左右大腿前侧', function: '伸展膝关节；股直肌还参与屈髋',
    dailyFact: '四部分中，股直肌跨过髋和膝两个关节。', medical: '肌肉网格保留双侧位置，未包含完整髌骨与肌腱装置。',
    bloodSupply: '股动脉、股深动脉及旋股外侧动脉等分支', funFact: '股中间肌位于股直肌深面，可旋转模型观察。',
  }, [spot('FJ1433', '右股直肌', '跨过髋关节与膝关节'), spot('FJ1442', '右股外侧肌', '股四头肌外侧部分'), spot('FJ1443', '右股内侧肌', '股四头肌内侧部分'), spot('FJ1441', '右股中间肌', '位于股直肌深面')]),
  entry('gluteal-muscles', '臀肌群', 'Gluteal muscles', muscle, '#bc8879', ['FMA64922'], {
    description: '本条目选取双侧臀大肌、臀中肌与臀小肌，展示髋部的主要伸展与外展肌群。',
    poetic: '稳定骨盆与髋', size: '覆盖骨盆后外侧的肌群', weight: '随体型与训练状态变化',
    location: '左右臀部及髋骨外侧', function: '参与伸髋、外展及行走时骨盆稳定',
    dailyFact: '单腿支撑时，臀中肌和臀小肌帮助维持骨盆稳定。', medical: '主动排除上游同组中的深层外旋肌等，避免名称与范围不符。',
    bloodSupply: '臀上动脉与臀下动脉', funFact: '臀小肌位于臀中肌深面，两者都参与髋部稳定。',
  }, [spot('FJ1418', '右臀大肌', '主要参与伸髋'), spot('FJ1419', '右臀中肌', '参与外展与骨盆稳定'), spot('FJ1420', '右臀小肌', '位于臀中肌深面')], {
    only: ['FJ1418', 'FJ1418M', 'FJ1419', 'FJ1419M', 'FJ1420', 'FJ1420M'],
  }),
  entry('bronchial-tree', '肺内支气管树', 'Intrapulmonary bronchial tree', '呼吸系统', '#9eb5b3', ['FMA31739'], {
    description: '左右肺内分支气道的参考模型，展现空气向肺内不同区域分配的树状路径。',
    poetic: '肺内的分支气道', size: '覆盖双肺区域的分支网络', weight: '管道不单列重量',
    location: '左右肺内部', function: '把吸入气体分配至不同肺段和更小气道',
    dailyFact: '肺段名称常用于描述气道供应的不同区域。', medical: '本模型不包含肺泡，源网格的分段数量不等于肺段数量。',
    bloodSupply: '气道壁主要由支气管动脉分支供血', funFact: '树状分支能把一条入口通道连接到广泛的肺内区域。',
  }, [spot('FJ2454', '右上叶尖段气道', '右侧尖段支气管树的一部分'), spot('FJ2459', '右下叶上段气道', '右侧下叶上段分支'), spot('FJ2444', '左侧尖段气道', '依源数据命名的左侧分支'), spot('FJ2540', '上舌段气道', '左肺舌段相关分支')]),
  entry('heart-valves', '心脏瓣膜', 'Cardiac valves', vascular, '#c8999d', ['FMA7232', 'FMA67598'], {
    description: '展示主动脉瓣、肺动脉瓣、二尖瓣和三尖瓣的瓣叶，保留它们在心脏中的相对位置。',
    poetic: '维持单向流动', size: '四组瓣膜分布于心脏入口和出口', weight: '瓣叶不单列重量',
    location: '房室交界及心室流出道', function: '随压力变化开闭，限制血液反流',
    dailyFact: '瓣膜的开闭主要由两侧压力差驱动。', medical: '静态瓣叶模型不包含完整腱索、乳头肌，也不模拟瓣膜运动。',
    bloodSupply: '瓣叶多依赖扩散营养，基底部与邻近冠脉微循环相连', funFact: '两组房室瓣与两组半月瓣具有不同的外形。',
  }, [spot('FJ2420', '二尖瓣前叶', '左房室瓣的前叶'), spot('FJ2421', '三尖瓣前叶', '右房室瓣的前叶'), spot('FJ2435', '主动脉瓣瓣叶', '位于左心室流出道'), spot('FJ2417', '肺动脉瓣瓣叶', '位于右心室流出道')]),
];
