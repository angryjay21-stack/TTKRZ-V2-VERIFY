require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  Events,
  PermissionsBitField,
} = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const VERIFY_CHANNEL_ID = process.env.VERIFY_CHANNEL_ID;
const VERIFY_ROLE_ID = process.env.VERIFY_ROLE_ID;

if (!TOKEN || !VERIFY_CHANNEL_ID || !VERIFY_ROLE_ID) {
  console.error(
    'Missing variables. Add DISCORD_TOKEN, VERIFY_CHANNEL_ID and VERIFY_ROLE_ID.'
  );
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const VERIFY_BUTTON_ID = 'ttkrz_v2_verify_button';

function buildVerifyMessage() {
  const banner = new AttachmentBuilder('./download.png', {
    name: 'download.png',
  });

  const embed = new EmbedBuilder()
    .setColor('#1ea7ff')
    .setAuthor({
      name: 'TTKRZ V2 VERIFY BOT',
    })
    .setTitle('TTKRZ V2 Verification')
    .setDescription(
      '**Verify to get access to TTKRZ V2**\n\n' +
      'Click the green verify button below to enter the server.\n' +
      'Make sure you have read the rules before loading into the city.'
    )
    .setImage('attachment://download.png')
    .setFooter({
      text: 'TTKRZ Verification Bot 3.0 • Secure access for new members',
    })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(VERIFY_BUTTON_ID)
      .setLabel('✓ Verify')
      .setStyle(ButtonStyle.Success)
  );

  return {
    content:
      'Welcome to TTKRZ V2.\nPress verify below to unlock the city and get access to the server.',
    embeds: [embed],
    components: [row],
    files: [banner],
  };
}

client.once(Events.ClientReady, async () => {
  console.log(`${client.user.tag} is online.`);

  try {
    const channel = await client.channels.fetch(VERIFY_CHANNEL_ID);

    if (!channel || !channel.isTextBased()) {
      console.error('VERIFY_CHANNEL_ID is invalid.');
      return;
    }

    const messages = await channel.messages.fetch({ limit: 50 });

    const existingPanel = messages.find(
      (msg) =>
        msg.author.id === client.user.id &&
        msg.components.length > 0
    );

    if (!existingPanel) {
      await channel.send(buildVerifyMessage());
      console.log('Verify panel sent.');
    } else {
      console.log('Verify panel already exists.');
    }
  } catch (err) {
    console.error(err);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== VERIFY_BUTTON_ID) return;

  const role =
    interaction.guild.roles.cache.get(VERIFY_ROLE_ID) ||
    (await interaction.guild.roles.fetch(VERIFY_ROLE_ID).catch(() => null));

  if (!role) {
    return interaction.reply({
      content: 'Verify role not found.',
      ephemeral: true,
    });
  }

  const botMember = interaction.guild.members.me;

  if (
    !botMember.permissions.has(
      PermissionsBitField.Flags.ManageRoles
    )
  ) {
    return interaction.reply({
      content: 'Bot needs Manage Roles permission.',
      ephemeral: true,
    });
  }

  if (role.position >= botMember.roles.highest.position) {
    return interaction.reply({
      content:
        'Move the bot role above the verify role in Server Settings → Roles.',
      ephemeral: true,
    });
  }

  if (interaction.member.roles.cache.has(role.id)) {
    return interaction.reply({
      content: 'You are already verified.',
      ephemeral: true,
    });
  }

  await interaction.member.roles.add(role);

  return interaction.reply({
    content: `✅ You are now verified, ${interaction.user}. Welcome to TTKRZ V2.`,
    ephemeral: true,
  });
});

client.login(TOKEN);
