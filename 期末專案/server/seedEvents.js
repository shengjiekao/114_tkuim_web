const Event = require('./models/Event');

const defaultEvents = [
    {
        title: "校園音樂祭 (Campus Music Festival)",
        description: "年度最大的校園音樂盛事！邀請多組知名樂團與歌手現場演出，還有豐富的美食攤位與創意市集。歡迎全校師生一同共襄盛舉，享受音樂與美食的饗宴！",
        date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week later
        location: "體育館前廣場 (Gymnasium Plaza)",
        maxParticipants: 500,
        image: "sing.jpg"
    },
    {
        title: "2024 就業博覽會 (Career Fair)",
        description: "廣邀百家知名企業進駐校園，提供實習與正職職缺諮詢。現場安排履歷健檢與模擬面試，幫助同學提早規劃職涯，贏在起跑點！",
        date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks later
        location: "學生活動中心 (Student Center)",
        maxParticipants: 300,
        image: "work.jpg"
    },
    {
        title: "系際盃籃球賽 (Basketball Tournament)",
        description: "熱血沸騰的系際籃球對抗賽即將開打！各系精銳盡出，爭奪冠軍榮耀。歡迎喜愛籃球的同學組隊報名，或到場為自己的系隊加油打氣！",
        date: new Date(new Date().getTime() + 21 * 24 * 60 * 60 * 1000), // 3 weeks later
        location: "室內體育館 (Indoor Arena)",
        maxParticipants: 100,
        image: "basketball.jpg"
    }
];

async function seedEvents() {
    try {
        const count = await Event.countDocuments();
        if (count === 0) {
            console.log('Seeding initial events...');
            await Event.insertMany(defaultEvents);
            console.log('Events seeded successfully!');
        } else {
            console.log(`Database already has ${count} events. Skipping seed.`);
        }
    } catch (err) {
        console.error('Error seeding events:', err);
    }
}

module.exports = seedEvents;
