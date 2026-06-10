const { Client, GatewayIntentBits, REST, Routes, ChannelType, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require('./config');
const { generateSite } = require('./generator');
const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '..', 'temp');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent], rest: { timeout: 180_000 } });

const sessions = new Map();
const SESSION_TTL = 60 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [id, s] of sessions) if (now - s.ts > SESSION_TTL) sessions.delete(id);
}, 60000);

function cleanTemp() {
  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}
cleanTemp();

client.once('clientReady', () => {
  console.log(`✓ ${client.user.tag} is online`);
  new REST({ version: '10' }).setToken(config.token)
    .put(Routes.applicationCommands(client.user.id), { body: [{ name: 'setup', description: 'إرسال بانل إنشاء البورتفولو (للمالك فقط)' }] })
    .then(() => console.log('✓ Commands synced'))
    .catch(e => console.error('Command sync failed:', e));
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || message.author.id !== config.ownerId) return;
  if (message.content.trim() === 'بانل') {
    const embed = new EmbedBuilder()
      .setColor(0xEAB308)
      .setTitle('DEVX SQ')
      .setDescription('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**صانع البورتفولو الشخصي**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n\nاضغط **إنشئ البورتفولو** 🚀\nوالبوت بيفتح لك تذكرة خاصة\nويملى معاك المعلومات خطوة بخطوة')
      .setImage('https://i.ibb.co/xq8qjh77/image-25.jpg');
    await message.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('create_site').setLabel('🚀 إنشئ البورتفولو').setStyle(ButtonStyle.Success))] });
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (!interaction.isRepliable()) return;
    // ====== /setup ======
    if (interaction.isChatInputCommand() && interaction.commandName === 'setup') {
      if (interaction.user.id !== config.ownerId) {
        await interaction.reply({ content: '❌ هذا الأمر للمالك فقط.', flags: 64 });
        return;
      }
      const embed = new EmbedBuilder()
        .setColor(0xEAB308)
        .setTitle('DEVX SQ')
        .setDescription('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**صانع البورتفولو الشخصي**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n\nاضغط **إنشئ البورتفولو** 🚀\والبوت بيفتح لك تذكرة خاصة\nويملى معاك المعلومات خطوة بخطوة')
        .setImage('https://i.ibb.co/xq8qjh77/image-25.jpg');
      await interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('create_site').setLabel('🚀 إنشئ البورتفولو').setStyle(ButtonStyle.Success))] });
      return;
    }

    // ====== زر "إنشئ البورتفولو" → يفتح تكت ======
    if (interaction.isButton() && interaction.customId === 'create_site') {
      try {
        await interaction.deferReply({ flags: 64 });
      } catch (e) {
        if (e.code === 10062) return;
        throw e;
      }
      try {
        const category = interaction.guild.channels.cache.get(config.ticketCategoryId);
        if (!category || category.type !== ChannelType.GuildCategory) {
          await interaction.editReply({ content: '❌ الكاتيجوري غير صالحة.' }).catch(() => {});
          return;
        }
        const ticketChannel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          parent: config.ticketCategoryId,
          permissionOverwrites: [
            { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks] },
            { id: config.ownerId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels] }
          ],
          reason: `DEVX SQ ticket - ${interaction.user.tag}`
        });
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('start_profile').setLabel('✨ ابدأ إنشاء البورتفولو').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('close_ticket').setLabel('🔒 إغلاق').setStyle(ButtonStyle.Danger)
        );
        await ticketChannel.send({ content: `مرحباً ${interaction.user}! 👋\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\nاضغط **ابدأ** عشان نصنعلك بورتفولو.\nاضغط **إغلاق** عشان تقفل التذكرة.`, components: [row] });
        await interaction.editReply({ content: `✅ تم فتح تذكرة لك: ${ticketChannel}` });
      } catch (e) {
        console.error('Ticket error:', e);
        try { await interaction.editReply({ content: '❌ تعذر إنشاء التذكرة. تأكد من صلاحيات البوت.' }); } catch (x) { if (x.code !== 10062) console.error(x); }
      }
      return;
    }

    // ====== زر "إغلاق" ======
    if (interaction.isButton() && interaction.customId === 'close_ticket') {
      const channel = interaction.channel;
      if (interaction.user.id !== config.ownerId && !channel.permissionsFor(interaction.user)?.has(PermissionFlagsBits.ManageChannels)) {
        await interaction.reply({ content: '❌ فقط المالك أو المشرف يقدر يقفل التذكرة.', flags: 64 });
        return;
      }
      await interaction.reply({ content: '🔒 **جاري إغلاق التذكرة...**' });
      setTimeout(() => { channel.delete().catch(() => {}); }, 2000);
      return;
    }

    // ====== زر "ابدأ" (جوا التكت) → مودال 1 ======
    if (interaction.isButton() && interaction.customId === 'start_profile') {
      const modal = new ModalBuilder().setCustomId('modal_step1').setTitle('إنشاء البورتفولو — الخطوة 1');
      modal.addComponents(
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('name').setLabel('الاسم').setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(100)),
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('profile_pic').setLabel('رابط صورة البروفايل').setStyle(TextInputStyle.Short).setRequired(true)),
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('bio').setLabel('البايو (اختياري)').setStyle(TextInputStyle.Paragraph).setRequired(false).setMaxLength(500)),
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('youtube').setLabel('رابط يوتيوب (اختياري)').setStyle(TextInputStyle.Short).setRequired(false)),
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('discord').setLabel('رابط ديسكورد (اختياري)').setStyle(TextInputStyle.Short).setRequired(false))
      );
      await interaction.showModal(modal);
      return;
    }

    // ====== مودال 1 → حفظ + زر الخطوة 2 ======
    if (interaction.isModalSubmit() && interaction.customId === 'modal_step1') {
      sessions.set(interaction.user.id, {
        name: interaction.fields.getTextInputValue('name'),
        profilePic: interaction.fields.getTextInputValue('profile_pic'),
        bio: interaction.fields.getTextInputValue('bio') || 'Hello World',
        youtube: interaction.fields.getTextInputValue('youtube') || '',
        discord: interaction.fields.getTextInputValue('discord') || '',
        ts: Date.now()
      });
      const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('step2_links').setLabel('📎 الخطوة 2: أضف روابط التواصل').setStyle(ButtonStyle.Secondary));
      try {
        await interaction.reply({ content: '✅ تم الحفظ!\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\nالآن أضف روابط التواصل:', components: [row] });
      } catch (e) { if (e.code !== 10062) throw e; }
      return;
    }

    // ====== زر الخطوة 2 → مودال 2 ======
    if (interaction.isButton() && interaction.customId === 'step2_links') {
      const modal2 = new ModalBuilder().setCustomId('modal_step2').setTitle('إنشاء البورتفولو — الخطوة 2');
      modal2.addComponents(
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('tiktok').setLabel('رابط تيك توك (اختياري)').setStyle(TextInputStyle.Short).setRequired(false)),
        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('github').setLabel('رابط جيت هاب (اختياري)').setStyle(TextInputStyle.Short).setRequired(false))
      );
      await interaction.showModal(modal2);
      return;
    }

    // ====== مودال 2 → إنشاء الموقع وإرساله ======
    if (interaction.isModalSubmit() && interaction.customId === 'modal_step2') {
      const session = sessions.get(interaction.user.id);
      if (!session) {
        await interaction.reply({ content: '❌ انتهت الجلسة. ارجع للتذكرة وابدأ من الأول.', flags: 64 });
        return;
      }
      sessions.delete(interaction.user.id);

      const userData = {
        name: session.name,
        profilePic: session.profilePic,
        bio: session.bio,
        youtube: session.youtube,
        discord: session.discord,
        tiktok: interaction.fields.getTextInputValue('tiktok') || '',
        github: interaction.fields.getTextInputValue('github') || ''
      };

      try {
        await interaction.reply({ content: '⏳ **استنى شوية..** يتم إنشاء البورتفولو...\n-# هينزل هنا في التذكرة بعد شوي', flags: 64 });
      } catch (e) { if (e.code !== 10062) throw e; }

      let zipPath = null;
      try {
        zipPath = await generateSite(userData);
        const safeName = userData.name.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30) || 'user';
        const fileName = `DEVXSQ-${safeName}.zip`;
        const channel = interaction.channel;

        async function sendZip(path, label, warning) {
          await channel.send({ content: warning ? `⚠️ ${warning}\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n✅ **| بورتفولو ${userData.name} ${label}**` : `✅ **| تم إنشاء بورتفولو ${userData.name} بنجاح!**`, files: [{ attachment: path, name: fileName }] });
        }

        if (channel && channel.isTextBased() && !channel.isThread()) {
          try {
            await sendZip(zipPath, '', null);
          } catch (e) {
            if (e.code === 400001) {
              try {
                await interaction.user.send({ content: `✅ **| تم إنشاء بورتفولو ${userData.name} بنجاح!**`, files: [{ attachment: zipPath, name: fileName }] });
                await channel.send({ content: `✅ **| تم إنشاء بورتفولو ${userData.name} بنجاح!**\n📨 تم إرسال الملف لك عبر الخاص.\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n⏳ **سيتم قفل التذكرة تلقائياً بعد 120 ثانية.**` });
              } catch {
                await channel.send({ content: `⚠️ **رفع الملفات مقيد في هذه السيرفر.**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n✅ **| تم إنشاء بورتفولو ${userData.name} بنجاح!**\n📁 يرجى تثبيت الملف.\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n⏳ **سيتم قفل التذكرة تلقائياً بعد 120 ثانية.**` });
              }
              setTimeout(() => { channel.delete().catch(() => {}); }, 120_000);
              return;
            }
            if (e.status !== 413 && e.code !== 40005 && !String(e.message).includes('large')) throw e;
            await interaction.editReply({ content: '⚠️ الملف كبير. جاري إنشاء نسخة بدون وسائط...' });
            try { fs.unlinkSync(zipPath); } catch (x) {}
            zipPath = await generateSite(userData, { excludeMedia: true });
            await sendZip(zipPath, '', 'الملف مع الفيديو كبير جداً.\nتم إرسال الموقع بدون فيديو/صوت — حطهم في assets/ يدويًا.');
          }
          await interaction.editReply({ content: '✅ تم! البورتفولو جاهز 👆' });
          setTimeout(() => { channel.delete().catch(() => {}); }, 30_000);
        } else {
          await interaction.editReply({ content: '✅ تم الإنشاء!', files: [{ attachment: zipPath, name: fileName }], flags: 64 });
        }
      } catch (err) {
        console.error('Generate/send error:', err);
        try { await interaction.editReply({ content: '❌ صار خطأ أثناء إنشاء البورتفولو.', flags: 64 }); } catch (e) {}
      } finally {
        if (zipPath && fs.existsSync(zipPath)) {
          try { fs.unlinkSync(zipPath); } catch (e) { console.error('ZIP cleanup:', e); }
        }
      }
      return;
    }
  } catch (err) {
    console.error(err);
    try { if (interaction.isRepliable()) await interaction.reply({ content: '❌ حدث خطأ.', flags: 64 }); } catch (e) {}
  }
});

client.login(config.token).catch(e => console.log('LOGIN FAILED:', e.message));
