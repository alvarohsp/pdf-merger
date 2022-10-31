export function onClickMergeBtn(): void {
  window.baseAPI.sendMsg('mergeButton', './pages/merger/merger.html');
}
