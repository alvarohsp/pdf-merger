// document.querySelector('#merge-btn').onclick = () => {
//   window.baseAPI.sendMsg('mergeButton');
// };

onClickMergeBtn = () => {
  window.baseAPI.sendMsg('mergeButton', './pages/merger/merger.html');
};
