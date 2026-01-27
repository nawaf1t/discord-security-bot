const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent, PermissionFlagsBits, ChannelType } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ═══════════════════════════════════════════════════════════════════════════
// ⚙️ الإعدادات الرئيسية - عدّلها حسب سيرفرك
// ═══════════════════════════════════════════════════════════════════════════

const config = {
    
    // المالك (محمي بالكامل - لا يمكن معاقبته أبداً)
    ownerId: '',
    
    // قناة اللوقات
    logChannelId: '',
    
    // قناة التنبيهات الطارئة (اختياري - للتنبيهات الخطيرة فقط)
    emergencyChannelId: '', // أو null
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💥 القوائم البيضاء
    // ═══════════════════════════════════════════════════════════════════════════
    
    // الأشخاص المصرح لهم (موثوقين 100%)
    trustedUsers: [
        // أضف آيديات الموثوقين
    ],
    
    // البوتات المصرحة (مسموح لها تنشئ/تحذف قنوات مؤقتة فقط)
    trustedBots: [
        // 'TEMP_CHANNEL_BOT_ID', // مثال: بوت الروم المؤقتة
    ],
    
    // الرتب المحمية (لا يمكن إعطاؤها لأحد إلا من المصرحين)
    protectedRoles: [
        // 'ADMIN_ROLE_ID',
        // 'MOD_ROLE_ID',
    ],
    
    // القنوات المحمية (لا يمكن حذفها نهائياً)
    protectedChannels: [


    ],
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔒 إعدادات الحماية المتطورة (صارمة جداً)
    // ═══════════════════════════════════════════════════════════════════════════
    
    protection: {
        // ─────────────────────────────────────────────────────────────────────────
        // 🔺 حماية القنوات (صارمة - حظر فوري)
        // ─────────────────────────────────────────────────────────────────────────
        channels: {
            enabled: true,
            
            // حظر الإنشاء (إلا للبوتات المصرحة)
            blockCreate: true,              // منع الإنشاء نهائياً
            createLimit: 1,                 // 1 محاولة = حظر فوري
            
            // حظر الحذف (صارم جداً)
            blockDelete: true,              // منع الحذف نهائياً
            deleteLimit: 1,                 // 1 حذف = حظر فوري
            
            timeWindow: 30000,              // 30 ثانية
            deleteCreated: true,            // حذف القنوات المنشأة
            restoreDeleted: true,           // استعادة المحذوفة
            instantBan: true,               // حظر فوري بدون تحذير
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // 🎭 حماية الرتب (صارمة جداً)
        // ─────────────────────────────────────────────────────────────────────────
        roles: {
            enabled: true,

            // ✅ Role Create Cooldown (رتبتين خلال دقيقتين = عقوبة)
            blockCreate: false,             // لا نمنع الإنشاء من الأساس - نراقب السبام
            createLimit: 2,                 // رتبتين داخل الوقت = عقوبة
            timeWindow: 120000,             // دقيقتين
            deleteCreated: true,            // حذف الرتب المنشأة عند تجاوز الحد
            punishOnCreateLimit: 'removeRoles', // إزالة كل رتب/صلاحيات المنفذ

            // حظر الحذف (خطير جداً)
            blockDelete: true,
            deleteLimit: 1,                 // أي حذف = حظر فوري

            instantBan: true,               // حظر فوري (للأشياء الخطيرة مثل حذف الرتب)
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // 🤖 حماية البوتات (طرد غير المصرح فوراً)
        // ─────────────────────────────────────────────────────────────────────────
        bots: {
            enabled: true,
            kickUnauthorized: true,
            banAdder: true,                 // حظر من أضاف البوت
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // ⚡ حماية الصلاحيات الخطيرة
        // ─────────────────────────────────────────────────────────────────────────
        permissions: {
            enabled: true,
            blockEveryoneAdmin: true,       // منع Admin لـ @everyone (legacy)
            blockAnyRoleAdmin: true,        // ✅ منع Admin لأي رتبة (كل الرولات)
            blockEveryoneDangerous: true,   // ✅ منع صلاحيات خطيرة لـ @everyone
            blockDangerousToPublic: true,   // منع صلاحيات خطيرة للرتب العامة
            blockAdminRoleGive: true,       // منع إعطاء رتب Admin
            instantBan: true,               // حظر فوري لمحاولات الصلاحيات
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // 🔨 حماية الطرد والحظر
        // ─────────────────────────────────────────────────────────────────────────
        moderation: {
            enabled: true,
            kickLimit: 5,                   // 5 طرد
            banLimit: 3,                    // 3 حظر
            timeWindow: 120000,             // دقيقتين
            instantBan: true,
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // 🔗 حماية الويب هوك
        // ─────────────────────────────────────────────────────────────────────────
        webhooks: {
            enabled: true,
            createLimit: 2,
            timeWindow: 60000,
            instantBan: true,
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // 🚨 Anti-Nuke (كشف التخريب الشامل - صارم جداً)
        // ─────────────────────────────────────────────────────────────────────────
        antiNuke: {
            enabled: true,
            threshold: 2,                   // 2 أفعال خطيرة = تخريب
            timeWindow: 30000,              // 30 ثانية
            autoBan: true,                  // حظر تلقائي فوري
            notifyOwner: true,              // إشعار المالك فوراً
        },
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔨 العقوبات (صارمة)
    // ═══════════════════════════════════════════════════════════════════════════
    
    punishment: {
        default: 'ban',                     // الافتراضي: حظر
        specific: {
            channelCreate: 'ban',           // إنشاء قناة = حظر
            channelDelete: 'ban',           // حذف قناة = حظر فوري
            roleCreate: 'ban',              // إنشاء رتبة = حظر
            roleDelete: 'ban',              // حذف رتبة = حظر فوري
            unauthorizedBot: 'ban',         // بوت غير مصرح = حظر
            everyoneAdmin: 'ban',           // Admin لـ everyone = حظر
            nukeAttempt: 'ban',             // محاولة تخريب = حظر
            massKick: 'ban',
            massBan: 'ban',
            dangerousPermission: 'ban',
        },
        notifyUser: true,                   // إشعار المعاقب
        notifyOwner: true,                  // إشعار المالك
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// 📊 نظام تتبع الأحداث المتقدم
// ═══════════════════════════════════════════════════════════════════════════

class ActionTracker {
    constructor() {
        this.actions = new Map();
        this.nukeTracker = new Map();
        this.violations = new Map();
        this.createdRoles = new Map(); // userId => [{ id, ts }]
        setInterval(() => this.cleanup(), 300000);
    }
    
    track(userId, actionType, timeWindow = 60000) {
        const key = `${userId}-${actionType}`;
        const now = Date.now();
        
        if (!this.actions.has(key)) {
            this.actions.set(key, []);
        }
        
        const actions = this.actions.get(key);
        actions.push(now);
        
        const filtered = actions.filter(time => now - time < timeWindow);
        this.actions.set(key, filtered);
        
        return filtered.length;
    }
    
    trackDangerous(userId) {
        const now = Date.now();
        
        if (!this.nukeTracker.has(userId)) {
            this.nukeTracker.set(userId, []);
        }
        
        const actions = this.nukeTracker.get(userId);
        actions.push(now);
        
        const filtered = actions.filter(time => now - time < config.protection.antiNuke.timeWindow);
        this.nukeTracker.set(userId, filtered);
        
        return filtered.length;
    }
    
    trackViolation(userId, type) {
        if (!this.violations.has(userId)) {
            this.violations.set(userId, []);
        }
        
        const violations = this.violations.get(userId);
        violations.push({ type, timestamp: Date.now() });
        
        return violations.length;
    }
    
    
    trackCreatedRole(userId, roleId) {
        const now = Date.now();
        if (!this.createdRoles.has(userId)) this.createdRoles.set(userId, []);
        const arr = this.createdRoles.get(userId);
        arr.push({ id: roleId, ts: now });
        // keep only last 10 minutes
        const filtered = arr.filter(r => now - r.ts < 600000);
        this.createdRoles.set(userId, filtered);
    }

    getRecentCreatedRoleIds(userId, timeWindow = 120000) {
        const now = Date.now();
        const arr = this.createdRoles.get(userId) || [];
        const filtered = arr.filter(r => now - r.ts < timeWindow);
        return filtered.map(r => r.id);
    }

    getViolations(userId) {
        return this.violations.get(userId) || [];
    }
    
    cleanup() {
        const now = Date.now();
        
        for (const [key, actions] of this.actions.entries()) {
            const filtered = actions.filter(time => now - time < 300000);
            if (filtered.length === 0) {
                this.actions.delete(key);
            } else {
                this.actions.set(key, filtered);
            }
        }
        
        for (const [userId, actions] of this.nukeTracker.entries()) {
            const filtered = actions.filter(time => now - time < 300000);
            if (filtered.length === 0) {
                this.nukeTracker.delete(userId);
            } else {
                this.nukeTracker.set(userId, filtered);
            }
        }


        for (const [userId, roles] of this.createdRoles.entries()) {
            const filtered = roles.filter(r => now - r.ts < 600000);
            if (filtered.length === 0) this.createdRoles.delete(userId);
            else this.createdRoles.set(userId, filtered);
        }
    }
}

const tracker = new ActionTracker();

// ═══════════════════════════════════════════════════════════════════════════
// 🔍 دوال التحقق
// ═══════════════════════════════════════════════════════════════════════════

const isTrusted = (userId) => userId === config.ownerId || config.trustedUsers.includes(userId);
const isTrustedBot = (botId) => config.trustedBots.includes(botId);
const isProtectedRole = (roleId) => config.protectedRoles.includes(roleId);
const isProtectedChannel = (channelId) => config.protectedChannels.includes(channelId);


async function getMe(guild) {
    // discord.js v14: guild.members.me may be null sometimes
    return guild.members.me || await guild.members.fetchMe().catch(() => null);
}

// ═══════════════════════════════════════════════════════════════════════════
// 📝 نظام اللوقات المتقدم
// ═══════════════════════════════════════════════════════════════════════════

async function sendLog(guild, options) {
    try {
        const logChannel = guild.channels.cache.get(config.logChannelId);
        if (!logChannel) return;
        
        const embed = new EmbedBuilder()
            .setTitle(options.title)
            .setDescription(options.description || '')
            .setColor(options.color || '#ff0000')
            .setTimestamp()
            .setFooter({ text: '🛡️ نظام الحماية المتطور V2 | HubSA' });
        
        if (options.fields) embed.addFields(options.fields);
        if (options.thumbnail) embed.setThumbnail(options.thumbnail);
        
        await logChannel.send({ embeds: [embed] });
    } catch (error) {
        console.error('[LOG ERROR]', error.message);
    }
}

async function sendEmergencyAlert(guild, options) {
    if (!config.emergencyChannelId && !config.protection.antiNuke.notifyOwner) return;
    
    try {
        // إرسال للقناة الطارئة
        if (config.emergencyChannelId) {
            const channel = guild.channels.cache.get(config.emergencyChannelId);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setTitle('🚨 تنبيه طارئ!')
                    .setDescription(options.description)
                    .setColor('#ff0000')
                    .setTimestamp();
                
                if (options.fields) embed.addFields(options.fields);
                
                await channel.send({ 
                    content: `<@${config.ownerId}>`,
                    embeds: [embed] 
                });
            }
        }
        
        // إشعار مباشر للمالك
        if (config.punishment.notifyOwner) {
            const owner = await guild.members.fetch(config.ownerId).catch(() => null);
            if (owner) {
                try {
                    await owner.send({ embeds: [new EmbedBuilder()
                        .setTitle('🚨 تنبيه أمني!')
                        .setDescription(`**السيرفر:** ${guild.name}\n\n${options.description}`)
                        .setColor('#ff0000')
                        .setTimestamp()
                    ]});
                } catch (e) {}
            }
        }
    } catch (error) {
        console.error('[EMERGENCY ALERT ERROR]', error.message);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ نظام العقوبات المتقدم
// ═══════════════════════════════════════════════════════════════════════════

async function punishUser(guild, userId, reason, punishmentType = null) {
    if (isTrusted(userId)) return false;
    
    try {
        const member = await guild.members.fetch(userId).catch(() => null);
        if (!member) return false;
        if (member.user.bot && isTrustedBot(member.id)) return false;
        
        const punishment = punishmentType || config.punishment.default;
        
        // تسجيل المخالفة
        tracker.trackViolation(userId, reason);
        
        // إشعار المعاقب
        if (config.punishment.notifyUser) {
            try {
                await member.send({
                    embeds: [new EmbedBuilder()
                        .setTitle('⚠️ تم معاقبتك')
                        .setDescription(`**السيرفر:** ${guild.name}\n**السبب:** ${reason}\n**العقوبة:** ${punishment === 'ban' ? 'حظر نهائي' : 'طرد'}`)
                        .setColor('#ff0000')
                        .setTimestamp()
                    ]
                });
            } catch (e) {}
        }
        
        // تطبيق العقوبة
        switch (punishment) {
            case 'removeRoles':
                const me = await getMe(guild);
                const highest = me?.roles?.highest?.position ?? 0;
                const roles = member.roles.cache.filter(r =>
                    r.id !== guild.id &&
                    r.position < highest &&
                    r.editable
                );
                if (roles.size > 0) {
                    await member.roles.remove(roles, `🛡️ ${reason}`);
                }
                break;
            case 'kick':
                if (member.kickable) await member.kick(`🛡️ ${reason}`);
                break;
            case 'ban':
                if (member.bannable) {
                    await member.ban({ reason: `🛡️ ${reason}`, deleteMessageSeconds: 86400 });
                }
                break;
        }
        
        // تسجيل في اللوقات
        await sendLog(guild, {
            title: '🔨 تم تطبيق عقوبة',
            color: '#e74c3c',
            fields: [
                { name: '👤 المعاقب', value: `<@${userId}>\n\`${member.user.tag}\``, inline: true },
                { name: '📋 السبب', value: reason, inline: true },
                { name: '⚡ العقوبة', value: punishment === 'removeRoles' ? 'إزالة الرتب' : punishment === 'kick' ? 'طرد' : '🔴 حظر نهائي', inline: true },
                { name: '📊 المخالفات السابقة', value: `${tracker.getViolations(userId).length} مخالفة`, inline: true },
            ],
            thumbnail: member.user.displayAvatarURL()
        });
        
        return true;
    } catch (error) {
        console.error('[PUNISHMENT ERROR]', error.message);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📍 جلب المنفذ من Audit Log
// ═══════════════════════════════════════════════════════════════════════════

async function getExecutor(guild, type, targetId = null) {
    try {
        await new Promise(r => setTimeout(r, 800));
        
        const auditLogs = await guild.fetchAuditLogs({ limit: 5, type });
        
        for (const entry of auditLogs.entries.values()) {
            if (Date.now() - entry.createdTimestamp > 15000) continue;
            if (targetId && entry.target?.id !== targetId) continue;
            
            return {
                executor: entry.executor,
                target: entry.target,
                reason: entry.reason
            };
        }
    } catch (error) {
        console.error('[AUDIT ERROR]', error.message);
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ حماية إنشاء القنوات (منع نهائي)
// ═══════════════════════════════════════════════════════════════════════════

client.on('channelCreate', async (channel) => {
    if (!config.protection.channels.enabled) return;
    if (!channel.guild) return;
    
    const audit = await getExecutor(channel.guild, AuditLogEvent.ChannelCreate);
    if (!audit) return;
    
    const { executor } = audit;
    
    // السماح للمصرحين والبوتات المصرحة فقط
    if (isTrusted(executor.id)) return;
    if (executor.bot && isTrustedBot(executor.id)) return;
    
    // 🚨 منع الإنشاء نهائياً
    if (config.protection.channels.blockCreate) {
        // حذف القناة فوراً
        await channel.delete('🛡️ إنشاء غير مصرح').catch(() => {});
        
        const count = tracker.track(executor.id, 'channelCreate', config.protection.channels.timeWindow);
        const dangerCount = tracker.trackDangerous(executor.id);
        
        // حظر فوري
        await punishUser(channel.guild, executor.id, 
            `محاولة إنشاء قناة بدون تصريح (${count} محاولة)`, 
            'ban'
        );
        
        // تنبيه طارئ
        await sendEmergencyAlert(channel.guild, {
            description: `⚠️ **محاولة إنشاء قناة غير مصرحة!**\n\n👤 المنفذ: <@${executor.id}>\n📝 القناة: ${channel.name}\n⚡ تم حظره فوراً`,
            fields: [
                { name: '📊 المحاولات', value: `${count}`, inline: true },
            ]
        });
        
        await sendLog(channel.guild, {
            title: '🚫 تم منع إنشاء قناة + حظر فوري',
            color: '#ff0000',
            fields: [
                { name: '📺 القناة', value: channel.name, inline: true },
                { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
                { name: '⚡ العقوبة', value: '🔴 حظر فوري', inline: true },
            ]
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ حماية حذف القنوات (منع نهائي + حظر فوري)
// ═══════════════════════════════════════════════════════════════════════════

client.on('channelDelete', async (channel) => {
    if (!config.protection.channels.enabled) return;
    if (!channel.guild) return;
    
    // حماية القنوات المحمية
    if (isProtectedChannel(channel.id)) {
        const audit = await getExecutor(channel.guild, AuditLogEvent.ChannelDelete);
        if (audit && !isTrusted(audit.executor.id)) {
            // استعادة فورية
            await channel.guild.channels.create({
                name: channel.name,
                type: channel.type,
                parent: channel.parent,
                position: channel.position,
                topic: channel.topic || undefined,
                nsfw: channel.nsfw || false,
                permissionOverwrites: channel.permissionOverwrites?.cache?.map(p => ({
                    id: p.id,
                    allow: p.allow,
                    deny: p.deny
                })) || [],
                reason: '🛡️ استعادة قناة محمية'
            });
            
            // حظر فوري
            await punishUser(channel.guild, audit.executor.id, 
                `🚨 حذف قناة محمية (${channel.name})`, 
                'ban'
            );
            
            await sendEmergencyAlert(channel.guild, {
                description: `🚨 **محاولة حذف قناة محمية!**\n\n👤 المنفذ: <@${audit.executor.id}>\n📝 القناة: ${channel.name}\n⚡ تم حظره فوراً واستعادة القناة`,
            });
        }
        return;
    }
    
    const audit = await getExecutor(channel.guild, AuditLogEvent.ChannelDelete);
    if (!audit) return;
    
    const { executor } = audit;
    
    if (isTrusted(executor.id)) return;
    if (executor.bot && isTrustedBot(executor.id)) return;
    
    const count = tracker.track(executor.id, 'channelDelete', config.protection.channels.timeWindow);
    const dangerCount = tracker.trackDangerous(executor.id);
    
    // Anti-Nuke
    if (config.protection.antiNuke.enabled && dangerCount >= config.protection.antiNuke.threshold) {
        await punishUser(channel.guild, executor.id, '🚨 محاولة تخريب السيرفر (Nuke)', 'ban');
        
        await sendEmergencyAlert(channel.guild, {
            description: `🚨🚨 **هجوم تخريبي مكتشف!**\n\n👤 المنفذ: <@${executor.id}>\n📊 الأفعال الخطيرة: ${dangerCount}\n⚡ تم حظره فوراً`,
        });
        
        return;
    }
    
    // 🚨 حذف قناة = حظر فوري
    if (config.protection.channels.blockDelete) {
        // استعادة القناة
        if (config.protection.channels.restoreDeleted) {
            try {
                await channel.guild.channels.create({
                    name: channel.name,
                    type: channel.type,
                    parent: channel.parent,
                    topic: channel.topic || undefined,
                    nsfw: channel.nsfw || false,
                    permissionOverwrites: channel.permissionOverwrites?.cache?.map(p => ({
                        id: p.id,
                        allow: p.allow,
                        deny: p.deny
                    })) || [],
                    reason: '🛡️ استعادة قناة محذوفة'
                });
            } catch (e) {}
        }
        
        // حظر فوري
        await punishUser(channel.guild, executor.id,
            `حذف قناة بدون تصريح (${channel.name})`,
            'ban'
        );
        
        await sendEmergencyAlert(channel.guild, {
            description: `⚠️ **تم حذف قناة!**\n\n👤 المنفذ: <@${executor.id}>\n📝 القناة: ${channel.name}\n⚡ تم حظره واستعادة القناة`,
        });
        
        await sendLog(channel.guild, {
            title: '🚫 تم حذف قناة + حظر فوري + استعادة',
            color: '#ff0000',
            fields: [
                { name: '📺 القناة', value: channel.name, inline: true },
                { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
                { name: '⚡ العقوبة', value: '🔴 حظر فوري', inline: true },
                { name: '✅ الحالة', value: 'تمت الاستعادة', inline: true },
            ]
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ حماية إنشاء الرتب (منع نهائي)
// ═══════════════════════════════════════════════════════════════════════════

client.on('roleCreate', async (role) => {
    if (!config.protection.roles.enabled) return;

    const audit = await getExecutor(role.guild, AuditLogEvent.RoleCreate);
    if (!audit) return;

    const { executor } = audit;

    // المصرحين والبوتات المصرحة
    if (isTrusted(executor.id)) return;
    if (executor.bot && isTrustedBot(executor.id)) return;

    // سجل الرتبة المنشأة
    tracker.trackCreatedRole(executor.id, role.id);

    // ✅ وضع الكول داون (رتبتين خلال دقيقتين)
    const count = tracker.track(executor.id, 'roleCreate', config.protection.roles.timeWindow);

    // لو أنت مفعل المنع النهائي، خله يشتغل مثل السابق
    if (config.protection.roles.blockCreate) {
        await role.delete('🛡️ إنشاء رتبة غير مصرح').catch(() => {});

        tracker.trackDangerous(executor.id);

        await punishUser(role.guild, executor.id,
            `محاولة إنشاء رتبة بدون تصريح (${role.name})`,
            'ban'
        );

        await sendEmergencyAlert(role.guild, {
            description: `⚠️ **محاولة إنشاء رتبة!**

👤 المنفذ: <@${executor.id}>
🎭 الرتبة: ${role.name}
⚡ تم حظره فوراً`,
        });

        await sendLog(role.guild, {
            title: '🚫 تم منع إنشاء رتبة + حظر فوري',
            color: '#ff0000',
            fields: [
                { name: '🎭 الرتبة', value: role.name, inline: true },
                { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
                { name: '⚡ العقوبة', value: '🔴 حظر فوري', inline: true },
            ]
        });
        return;
    }

    // ✅ الكول داون: إذا وصل 2 خلال دقيقتين = عقوبة (إزالة كل الصلاحيات/الرتب)
    if (count >= config.protection.roles.createLimit) {
        // حذف كل الرتب اللي انشأها خلال نفس الوقت (إذا تقدر)
        if (config.protection.roles.deleteCreated) {
            const ids = tracker.getRecentCreatedRoleIds(executor.id, config.protection.roles.timeWindow);
            for (const id of ids) {
                const r = role.guild.roles.cache.get(id);
                if (!r) continue;
                if (r.managed) continue;
                if (!r.editable) continue;
                await r.delete('🛡️ Role Create Cooldown تجاوز الحد').catch(() => {});
            }
        }

        // إزالة كل الرتب من المنفذ (يعني تشيل كل صلاحياته تقريباً)
        await punishUser(role.guild, executor.id,
            `Role Create Spam: أنشأ ${count} رتب خلال ${Math.round(config.protection.roles.timeWindow/1000)} ثانية`,
            config.protection.roles.punishOnCreateLimit || 'removeRoles'
        );

        // اعتبرها فعل خطير
        for (let i = 0; i < 3; i++) tracker.trackDangerous(executor.id);

        await sendEmergencyAlert(role.guild, {
            description: `🚨 **Role Create Spam**

👤 المنفذ: <@${executor.id}>
🎭 آخر رتبة: ${role.name}
📊 العدد: ${count}
⚡ تم إزالة كل صلاحياته (Strip Roles) وحذف الرتب اللي سواها`,
            fields: [
                { name: '📊 العدد خلال النافذة', value: `${count}/${config.protection.roles.createLimit}`, inline: true },
            ]
        });

        await sendLog(role.guild, {
            title: '🚨 Role Create Cooldown Triggered',
            color: '#ff9500',
            fields: [
                { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
                { name: '🎭 آخر رتبة', value: role.name, inline: true },
                { name: '📊 العدد', value: `${count}`, inline: true },
                { name: '⚡ العقوبة', value: 'إزالة كل الرتب/الصلاحيات', inline: true },
            ]
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ حماية حذف الرتب (منع نهائي + حظر فوري)
// ═══════════════════════════════════════════════════════════════════════════

client.on('roleDelete', async (role) => {
    if (!config.protection.roles.enabled) return;
    
    const audit = await getExecutor(role.guild, AuditLogEvent.RoleDelete);
    if (!audit) return;
    
    const { executor } = audit;
    
    if (isTrusted(executor.id)) return;
    if (executor.bot && isTrustedBot(executor.id)) return;
    
    // 🚨 حذف رتبة = حظر فوري
    if (config.protection.roles.blockDelete) {
        const count = tracker.track(executor.id, 'roleDelete', config.protection.roles.timeWindow);
        tracker.trackDangerous(executor.id);
        
        await punishUser(role.guild, executor.id,
            `حذف رتبة بدون تصريح (${role.name})`,
            'ban'
        );
        
        await sendEmergencyAlert(role.guild, {
            description: `🚨 **تم حذف رتبة!**\n\n👤 المنفذ: <@${executor.id}>\n🎭 الرتبة: ${role.name}\n⚡ تم حظره فوراً`,
        });
        
        await sendLog(role.guild, {
            title: '🚫 تم حذف رتبة + حظر فوري',
            color: '#ff0000',
            fields: [
                { name: '🎭 الرتبة', value: role.name, inline: true },
                { name: '🎨 اللون', value: role.hexColor, inline: true },
                { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
                { name: '⚡ العقوبة', value: '🔴 حظر فوري', inline: true },
            ]
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ حماية تعديل الرتب - إعطاء Admin لـ @everyone
// ═══════════════════════════════════════════════════════════════════════════

client.on('roleUpdate', async (oldRole, newRole) => {
    if (!config.protection.permissions.enabled) return;

    const audit = await getExecutor(newRole.guild, AuditLogEvent.RoleUpdate, newRole.id);
    if (!audit) return;

    const { executor } = audit;

    // اسمح للبوتات المصرحة
    if (executor.bot && isTrustedBot(executor.id)) return;

    // ✅ استثناء المالك فقط (طلبك)
    if (executor.id === config.ownerId) return;

    // ✅ حماية Admin لأي رتبة (مو بس everyone)
    if (config.protection.permissions.blockAnyRoleAdmin) {
        const hadAdmin = oldRole.permissions.has(PermissionFlagsBits.Administrator);
        const hasAdmin = newRole.permissions.has(PermissionFlagsBits.Administrator);

        if (!hadAdmin && hasAdmin) {
            // إلغاء فوري (نشيل Admin)
            await newRole.setPermissions(oldRole.permissions, '🛡️ Anti-Admin Escalation');

            // حظر فوري للي عطاه
            await punishUser(newRole.guild, executor.id,
                `🚨 محاولة إعطاء Administrator لرتبة (${newRole.name})`,
                'ban'
            );

            // نخليها Nuke Attempt (علشان لو فيه سبام)
            for (let i = 0; i < 10; i++) tracker.trackDangerous(executor.id);

            await sendEmergencyAlert(newRole.guild, {
                description: `🚨 **Admin Escalation Blocked**

👤 المنفذ: <@${executor.id}>
🎭 الرتبة: ${newRole.name}
⚡ تم حذف Administrator + حظر المنفذ`,
            });

            await sendLog(newRole.guild, {
                title: '🚨 تم منع إعطاء Administrator لأي رتبة',
                color: '#ff0000',
                fields: [
                    { name: '🎭 الرتبة', value: newRole.name, inline: true },
                    { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
                    { name: '⚡ العقوبة', value: '🔴 حظر + حذف Administrator', inline: true },
                ]
            });
            return;
        }
    }

    // بعد حماية الـAdmin، نخلي المصرحين يعدّلون الأشياء العادية براحتهم
    if (isTrusted(executor.id)) return;

    // 🚨 كشف إعطاء Admin لـ @everyone (خطير جداً)
    if (config.protection.permissions.blockEveryoneAdmin && newRole.id === newRole.guild.id) {
        const hadAdmin = oldRole.permissions.has(PermissionFlagsBits.Administrator);
        const hasAdmin = newRole.permissions.has(PermissionFlagsBits.Administrator);
        
        if (!hadAdmin && hasAdmin) {
            // إلغاء فوري
            await newRole.setPermissions(oldRole.permissions, '🛡️ حماية - Admin لـ everyone');
            
            // حظر فوري
            await punishUser(newRole.guild, executor.id,
                '🚨🚨 محاولة إعطاء Administrator لـ @everyone',
                'ban'
            );
            
            // تسجيل كتخريب
            for (let i = 0; i < 10; i++) tracker.trackDangerous(executor.id);
            
            await sendEmergencyAlert(newRole.guild, {
                description: `🚨🚨 **هجوم خطير جداً!**\n\n محاولة إعطاء Admin لـ @everyone\n👤 المنفذ: <@${executor.id}>\n⚡ تم حظره فوراً وإلغاء العملية`,
            });
            
            await sendLog(newRole.guild, {
                title: '🚨🚨 هجوم خطير جداً!',
                description: '**تم محاولة إعطاء Admin لـ @everyone**\nتم إلغاء العملية وحظر المنفذ',
                color: '#ff0000',
                fields: [
                    { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
                    { name: '⚡ العقوبة', value: '🔴 حظر فوري', inline: true },
                ]
            });
            return;
        }
    }
    

    // 🚨 منع أي صلاحيات خطيرة لـ @everyone (حتى بدون Administrator)
    if (config.protection.permissions.blockEveryoneDangerous && newRole.id === newRole.guild.id) {
        const dangerous = [
            PermissionFlagsBits.ManageGuild,
            PermissionFlagsBits.ManageRoles,
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.BanMembers,
            PermissionFlagsBits.KickMembers,
            PermissionFlagsBits.ManageWebhooks,
        ];

        for (const perm of dangerous) {
            const had = oldRole.permissions.has(perm);
            const has = newRole.permissions.has(perm);
            if (!had && has) {
                await newRole.setPermissions(oldRole.permissions, '🛡️ Dangerous perms to @everyone');

                await punishUser(newRole.guild, executor.id,
                    '🚨 محاولة إعطاء صلاحيات خطيرة لـ @everyone',
                    'ban'
                );

                for (let i = 0; i < 5; i++) tracker.trackDangerous(executor.id);

                await sendEmergencyAlert(newRole.guild, {
                    description: `🚨 **Dangerous perms to @everyone blocked**

👤 المنفذ: <@${executor.id}>
⚡ تم إلغاء التعديل + حظر المنفذ`,
                });

                await sendLog(newRole.guild, {
                    title: '🚨 تم منع صلاحيات خطيرة لـ @everyone',
                    color: '#ff0000',
                    fields: [
                        { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
                        { name: '⚡ العقوبة', value: '🔴 حظر', inline: true },
                    ]
                });
                return;
            }
        }
    }

    // ⚠️ كشف إعطاء صلاحيات خطيرة لرتب عامة
    if (config.protection.permissions.blockDangerousToPublic) {
        const dangerousPerms = [
            PermissionFlagsBits.Administrator,
            PermissionFlagsBits.ManageGuild,
            PermissionFlagsBits.ManageRoles,
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.BanMembers,
            PermissionFlagsBits.KickMembers,
            PermissionFlagsBits.ManageWebhooks,
        ];
        
        for (const perm of dangerousPerms) {
            const hadPerm = oldRole.permissions.has(perm);
            const hasPerm = newRole.permissions.has(perm);
            
            if (!hadPerm && hasPerm) {
                const membersCount = newRole.members.size;
                
                // إذا الرتبة عند أكثر من 10 شخص = رتبة عامة
                if (membersCount > 10) {
                    await newRole.setPermissions(oldRole.permissions, '🛡️ صلاحية خطيرة لرتبة عامة');
                    
                    await punishUser(newRole.guild, executor.id,
                        `إعطاء صلاحية خطيرة لرتبة عامة (${newRole.name} - ${membersCount} عضو)`,
                        'ban'
                    );
                    
                    tracker.trackDangerous(executor.id);
                    
                    await sendLog(newRole.guild, {
                        title: '⚠️ تم منع صلاحية خطيرة',
                        color: '#ff9500',
                        fields: [
                            { name: '🎭 الرتبة', value: newRole.name, inline: true },
                            { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
                            { name: '👥 عدد الأعضاء', value: `${membersCount}`, inline: true },
                        ]
                    });
                    return;
                }
            }
        }
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ حماية إعطاء الرتب المحمية / رتب Admin
// ═══════════════════════════════════════════════════════════════════════════

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (!config.protection.permissions.enabled) return;
    
    const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    if (addedRoles.size === 0) return;
    
    const audit = await getExecutor(newMember.guild, AuditLogEvent.MemberRoleUpdate, newMember.id);
    if (!audit) return;
    
    const { executor } = audit;
    
    if (isTrusted(executor.id)) return;
    if (executor.bot && isTrustedBot(executor.id)) return;
    
    for (const role of addedRoles.values()) {
        // منع إعطاء رتب محمية
        if (isProtectedRole(role.id)) {
            await newMember.roles.remove(role, '🛡️ رتبة محمية');
            
            await punishUser(newMember.guild, executor.id,
                `إعطاء رتبة محمية (${role.name})`,
                'ban'
            );
            
            tracker.trackDangerous(executor.id);
            
            await sendLog(newMember.guild, {
                title: '⛔ تم منع إعطاء رتبة محمية',
                color: '#9b59b6',
                fields: [
                    { name: '🎭 الرتبة', value: role.name, inline: true },
                    { name: '👤 المستلم', value: `<@${newMember.id}>`, inline: true },
                    { name: '👤 المعطي', value: `<@${executor.id}>`, inline: true },
                ]
            });
            continue;
        }
        
        // منع إعطاء رتب بها Admin
        if (config.protection.permissions.blockAdminRoleGive && 
            role.permissions.has(PermissionFlagsBits.Administrator)) {
            
            await newMember.roles.remove(role, '🛡️ رتبة Admin');
            
            await punishUser(newMember.guild, executor.id,
                `إعطاء رتبة Admin (${role.name})`,
                'ban'
            );
            
            tracker.trackDangerous(executor.id);
            
            await sendLog(newMember.guild, {
                title: '⛔ تم منع إعطاء رتبة Admin',
                color: '#e74c3c',
                fields: [
                    { name: '🎭 الرتبة', value: role.name, inline: true },
                    { name: '👤 المستلم', value: `<@${newMember.id}>`, inline: true },
                    { name: '👤 المعطي', value: `<@${executor.id}>`, inline: true },
                ]
            });
        }
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ حماية إضافة البوتات
// ═══════════════════════════════════════════════════════════════════════════

client.on('guildMemberAdd', async (member) => {
    if (!config.protection.bots.enabled) return;
    if (!member.user.bot) return;
    
    // بوت مصرح
    if (isTrustedBot(member.id)) {
        await sendLog(member.guild, {
            title: '✅ تم إضافة بوت مصرح',
            color: '#00ff00',
            fields: [
                { name: '🤖 البوت', value: `<@${member.id}>\n${member.user.tag}`, inline: true },
            ]
        });
        return;
    }
    
    const audit = await getExecutor(member.guild, AuditLogEvent.BotAdd);
    
    // طرد البوت
    if (config.protection.bots.kickUnauthorized) {
        await member.kick('🛡️ بوت غير مصرح').catch(() => {});
    }
    
    // حظر من أضافه
    if (audit && config.protection.bots.banAdder && !isTrusted(audit.executor.id)) {
        await punishUser(member.guild, audit.executor.id,
            `إضافة بوت غير مصرح (${member.user.tag})`,
            'ban'
        );
        
        tracker.trackDangerous(audit.executor.id);
    }
    
    await sendLog(member.guild, {
        title: '🚫 تم طرد بوت غير مصرح + حظر المضيف',
        color: '#e74c3c',
        fields: [
            { name: '🤖 البوت', value: `${member.user.tag}\n\`${member.id}\``, inline: true },
            { name: '👤 أضافه', value: audit ? `<@${audit.executor.id}>` : 'غير معروف', inline: true },
            { name: '⚡ العقوبة', value: '🔴 حظر', inline: true },
        ]
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ حماية الطرد الجماعي
// ═══════════════════════════════════════════════════════════════════════════

client.on('guildMemberRemove', async (member) => {
    if (!config.protection.moderation.enabled) return;
    if (member.user.bot) return;
    
    const audit = await getExecutor(member.guild, AuditLogEvent.MemberKick, member.id);
    if (!audit) return;
    
    const { executor } = audit;
    
    if (isTrusted(executor.id)) return;
    if (executor.bot && isTrustedBot(executor.id)) return;
    
    const count = tracker.track(executor.id, 'kick', config.protection.moderation.timeWindow);
    
    if (count >= config.protection.moderation.kickLimit) {
        await punishUser(member.guild, executor.id,
            `طرد جماعي (${count} عضو)`,
            'ban'
        );
        
        await sendLog(member.guild, {
            title: '🚨 طرد جماعي مشبوه',
            color: '#e74c3c',
            fields: [
                { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
                { name: '📢 العدد', value: `${count}`, inline: true },
                { name: '⚡ العقوبة', value: '🔴 حظر', inline: true },
            ]
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ حماية الحظر الجماعي
// ═══════════════════════════════════════════════════════════════════════════

client.on('guildBanAdd', async (ban) => {
    if (!config.protection.moderation.enabled) return;
    
    const audit = await getExecutor(ban.guild, AuditLogEvent.MemberBanAdd, ban.user.id);
    if (!audit) return;
    
    const { executor } = audit;
    
    if (isTrusted(executor.id)) return;
    if (executor.bot && isTrustedBot(executor.id)) return;
    
    const count = tracker.track(executor.id, 'ban', config.protection.moderation.timeWindow);
    
    if (count >= config.protection.moderation.banLimit) {
        // فك الحظر
        await ban.guild.members.unban(ban.user.id, '🛡️ حظر جماعي').catch(() => {});
        
        await punishUser(ban.guild, executor.id,
            `حظر جماعي (${count} عضو)`,
            'ban'
        );
        
        await sendLog(ban.guild, {
            title: '🚨 حظر جماعي مشبوه',
            color: '#e74c3c',
            fields: [
                { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
                { name: '📢 العدد', value: `${count}`, inline: true },
                { name: '⚡ العقوبة', value: '🔴 حظر', inline: true },
            ]
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ حماية الويب هوك
// ═══════════════════════════════════════════════════════════════════════════

client.on('webhooksUpdate', async (channel) => {
    if (!config.protection.webhooks.enabled) return;
    
    const audit = await getExecutor(channel.guild, AuditLogEvent.WebhookCreate);
    if (!audit) return;
    
    const { executor } = audit;
    
    if (isTrusted(executor.id)) return;
    if (executor.bot && isTrustedBot(executor.id)) return;
    
    const count = tracker.track(executor.id, 'webhook', config.protection.webhooks.timeWindow);
    
    if (count >= config.protection.webhooks.createLimit) {
        try {
            const webhooks = await channel.fetchWebhooks();
            for (const wh of webhooks.values()) {
                if (Date.now() - wh.createdTimestamp < 30000) {
                    await wh.delete('🛡️ ويب هوك غير مصرح');
                }
            }
        } catch (e) {}
        
        await punishUser(channel.guild, executor.id, 'إنشاء ويب هوكس مفرط', 'ban');
        
        await sendLog(channel.guild, {
            title: '🔗 تم حذف ويب هوك + حظر',
            color: '#3498db',
            fields: [
                { name: '📺 القناة', value: `<#${channel.id}>`, inline: true },
                { name: '👤 المنفذ', value: `<@${executor.id}>`, inline: true },
            ]
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 📋 أوامر التحكم
// ═══════════════════════════════════════════════════════════════════════════

client.on('messageCreate', async (message) => {
    if (!message.guild || message.author.bot) return;
    if (!isTrusted(message.author.id)) return;
    
    const args = message.content.split(' ');
    const cmd = args[0].toLowerCase();
    
    // تصريح شخص
    if (cmd === '!trust' || cmd === '!صرح') {
        const userId = message.mentions.users.first()?.id || args[1];
        if (!userId) return message.reply('❌ حدد الشخص');
        
        if (config.trustedUsers.includes(userId)) return message.reply('✅ مصرح بالفعل');
        config.trustedUsers.push(userId);
        
        message.reply({ embeds: [new EmbedBuilder()
            .setTitle('✅ تم التصريح')
            .setDescription(`<@${userId}>`)
            .setColor('#00ff00')
        ]});
    }
    
    // إلغاء تصريح
    if (cmd === '!untrust' || cmd === '!الغاء') {
        const userId = message.mentions.users.first()?.id || args[1];
        if (!userId) return message.reply('❌ حدد الشخص');
        if (userId === config.ownerId) return message.reply('❌ لا يمكن إلغاء تصريح المالك');
        
        const idx = config.trustedUsers.indexOf(userId);
        if (idx === -1) return message.reply('❌ غير مصرح');
        config.trustedUsers.splice(idx, 1);
        
        message.reply({ embeds: [new EmbedBuilder()
            .setTitle('🚫 تم إلغاء التصريح')
            .setDescription(`<@${userId}>`)
            .setColor('#ff0000')
        ]});
    }
    
    // تصريح بوت
    if (cmd === '!trustbot' || cmd === '!صرحبوت') {
        const botId = args[1];
        if (!botId) return message.reply('❌ حدد آيدي البوت');
        
        if (config.trustedBots.includes(botId)) return message.reply('✅ مصرح بالفعل');
        config.trustedBots.push(botId);
        
        message.reply({ embeds: [new EmbedBuilder()
            .setTitle('🤖 تم تصريح البوت')
            .setDescription(`\`${botId}\``)
            .setColor('#00ff00')
        ]});
    }
    
    // حماية رتبة
    if (cmd === '!protect' || cmd === '!حماية') {
        const roleId = message.mentions.roles.first()?.id || args[1];
        if (!roleId) return message.reply('❌ حدد الرتبة');
        
        if (config.protectedRoles.includes(roleId)) return message.reply('✅ محمية بالفعل');
        config.protectedRoles.push(roleId);
        
        message.reply({ embeds: [new EmbedBuilder()
            .setTitle('🛡️ تم حماية الرتبة')
            .setDescription(`<@&${roleId}>`)
            .setColor('#9b59b6')
        ]});
    }
    
    // حماية قناة
    if (cmd === '!protectchannel' || cmd === '!حمايةقناة') {
        const channelId = message.mentions.channels.first()?.id || args[1];
        if (!channelId) return message.reply('❌ حدد القناة');
        
        if (config.protectedChannels.includes(channelId)) return message.reply('✅ محمية بالفعل');
        config.protectedChannels.push(channelId);
        
        message.reply({ embeds: [new EmbedBuilder()
            .setTitle('🛡️ تم حماية القناة')
            .setDescription(`<#${channelId}>`)
            .setColor('#9b59b6')
        ]});
    }
    
    // القوائم
    if (cmd === '!whitelist' || cmd === '!قوائم') {
        const trusted = config.trustedUsers.map(id => `<@${id}>`).join('\n') || 'لا يوجد';
        const bots = config.trustedBots.map(id => `\`${id}\``).join('\n') || 'لا يوجد';
        const roles = config.protectedRoles.map(id => `<@&${id}>`).join('\n') || 'لا يوجد';
        const channels = config.protectedChannels.map(id => `<#${id}>`).join('\n') || 'لا يوجد';
        
        message.reply({ embeds: [new EmbedBuilder()
            .setTitle('📋 القوائم')
            .setColor('#3498db')
            .addFields(
                { name: '👤 المصرحين', value: trusted, inline: true },
                { name: '🤖 البوتات', value: bots, inline: true },
                { name: '🎭 الرتب المحمية', value: roles, inline: true },
                { name: '📺 القنوات المحمية', value: channels, inline: true },
            )
        ]});
    }
    
    // الحالة
    if (cmd === '!status' || cmd === '!حالة') {
        const s = (v) => v ? '✅' : '❌';
        const p = config.protection;
        
        message.reply({ embeds: [new EmbedBuilder()
            .setTitle('🛡️ حالة الحماية المتطورة V2')
            .setColor('#3498db')
            .addFields(
                { name: '📺 القنوات', value: `${s(p.channels.enabled)}\nحظر الإنشاء: ${s(p.channels.blockCreate)}\nحظر الحذف: ${s(p.channels.blockDelete)}`, inline: true },
                { name: '🎭 الرتب', value: `${s(p.roles.enabled)}\nحظر الإنشاء: ${s(p.roles.blockCreate)}\nحظر الحذف: ${s(p.roles.blockDelete)}`, inline: true },
                { name: '🤖 البوتات', value: `${s(p.bots.enabled)}\nحظر المضيف: ${s(p.bots.banAdder)}`, inline: true },
                { name: '⚡ الصلاحيات', value: `${s(p.permissions.enabled)}\nحظر فوري: ${s(p.permissions.instantBan)}`, inline: true },
                { name: '🔨 الإدارة', value: `${s(p.moderation.enabled)}\nطرد: ${p.moderation.kickLimit}\nحظر: ${p.moderation.banLimit}`, inline: true },
                { name: '🚨 Anti-Nuke', value: `${s(p.antiNuke.enabled)}\nالحد: ${p.antiNuke.threshold}\nإشعار المالك: ${s(p.antiNuke.notifyOwner)}`, inline: true },
            )
            .setFooter({ text: '🔴 النظام في وضع الحماية الكاملة' })
        ]});
    }
    
    // المساعدة
    if (cmd === '!help' || cmd === '!مساعدة') {
        message.reply({ embeds: [new EmbedBuilder()
            .setTitle('📖 أوامر الحماية المتطورة V2')
            .setColor('#3498db')
            .setDescription('**🔴 النظام في وضع الحماية الكاملة**\nأي حذف/إنشاء = حظر فوري')
            .addFields(
                { name: '👤 المصرحين', value: '`!trust @` / `!untrust @`', inline: true },
                { name: '🤖 البوتات', value: '`!trustbot ID` / `!untrustbot ID`', inline: true },
                { name: '🎭 الرتب', value: '`!protect @role`', inline: true },
                { name: '📺 القنوات', value: '`!protectchannel #channel`', inline: true },
                { name: '⚙️ إعدادات', value: '`!whitelist` `!status`', inline: false },
            )
        ]});
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 تشغيل البوت
// ═══════════════════════════════════════════════════════════════════════════

client.once('ready', () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                                                               ║');
    console.log('║      🛡️  نظام الحماية المتطور V2 - HubSA Protection        ║');
    console.log('║           🔴 وضع الحماية الكاملة مُفعّل                     ║');
    console.log('║                                                               ║');
    console.log(`║      Bot: ${client.user.tag.padEnd(47)}║`);
    console.log(`║      Guilds: ${client.guilds.cache.size.toString().padEnd(45)}║`);
    console.log('║                                                               ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('🔴 STRICT MODE ACTIVE:');
    console.log('   ├─ Channel Create: BLOCKED (Ban on attempt)');
    console.log('   ├─ Channel Delete: BLOCKED (Ban + Restore)');
    console.log('   ├─ Role Create: BLOCKED (Ban on attempt)');
    console.log('   ├─ Role Delete: BLOCKED (Ban on attempt)');
    console.log('   ├─ Unauthorized Bots: INSTANT BAN');
    console.log('   ├─ Dangerous Permissions: INSTANT BAN');
    console.log('   └─ Anti-Nuke Threshold: 2 actions');
    console.log('');
    console.log('✅ All Systems Armed and Ready');
    console.log('');
});

client.on('error', e => console.error('[ERROR]', e.message));
process.on('unhandledRejection', e => console.error('[UNHANDLED]', e.message));

client.login(config.token);