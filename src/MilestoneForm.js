export const renderMilestoneForm = (transactionId) => {\n  const form = document.createElement('div');\n  form.className = 'milestone-form';\n  form.innerHTML = '<h4>Add Milestone</h4>';\n    form.querySelector('#m-add').addEventListener('click', async () => {
    const desc = form.querySelector('#m-desc').value;
    const amt = form.querySelector('#m-amount').value;
    const { addMilestoneOnChain } = await import('./ContractInteractions.js');
    await addMilestoneOnChain(transactionId, Date.now(), desc, amt);
  });
  return form;\n};
