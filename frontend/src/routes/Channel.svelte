<script>
  import Chat from '../components/Chat.svelte';
  export let params = {};
</script>

<div class="root">
  <Chat channelId={params.id} />
</div>