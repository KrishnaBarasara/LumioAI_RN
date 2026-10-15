import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import type { MeetingSummary } from '@/types';

function buildMarkdown(summary: MeetingSummary, transcript?: string) {
  let md = `# Meeting Summary\n\n${summary.executiveSummary}\n\n`;
  md += `## Sentiment\n${summary.sentiment.label} (${summary.sentiment.score}%)\n\n`;
  md += `## Key Points\n${summary.keyPoints.map((p) => `- ${p}`).join('\n')}\n\n`;
  md += `## Action Items\n${summary.actionItems.map((a) => `- [${a.completed ? 'x' : ' '}] ${a.title}`).join('\n')}\n\n`;
  md += `## Next Steps\n${summary.nextSteps.map((s) => `- ${s}`).join('\n')}\n`;
  if (transcript) {
    md += `\n## Transcript\n\n${transcript}\n`;
  }
  return md;
}

export const exportService = {
  async shareAsMarkdown(summary: MeetingSummary, transcript?: string) {
    const md = buildMarkdown(summary, transcript);
    const path = `${FileSystem.cacheDirectory}meeting-${summary.meetingId}.md`;
    await FileSystem.writeAsStringAsync(path, md);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path, { mimeType: 'text/markdown' });
    }
    return path;
  },

  async shareAsText(summary: MeetingSummary) {
    const text = buildMarkdown(summary).replace(/#/g, '');
    const path = `${FileSystem.cacheDirectory}meeting-${summary.meetingId}.txt`;
    await FileSystem.writeAsStringAsync(path, text);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path, { mimeType: 'text/plain' });
    }
    return path;
  },
};
