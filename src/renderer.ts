export function onClickMergeBtn(): void {
  window.baseAPI.sendMsg('mergeButton', './pages/merger/merger.html');
}

export function openLinkGithub(): void {
  window.baseAPI.sendMsg(
    'openExShell',
    'https://github.com/alvarohsp'
  );
}
