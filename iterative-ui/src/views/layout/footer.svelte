<script lang="ts">
  import { _ } from 'svelte-i18n';
</script>

<div id="footer">
  <div>
    <p>{$_('project_by')}:</p>
    <a href="https://www.vislab.io"><img src="assets/images/vislab_logo.png" alt="VISLAB.io" /></a>
  </div>
  <div>
    <a href="https://www.bmbf.de"><img src="assets/images/bmbf.svg" alt="{$_('by_bmbf')}" /></a>
  </div>
  <div>
    <p>Public Money, Public Code:</p>
    <a href="https://www.github.com/sebastian-meier/LoCobSS-documentation"><img src="assets/images/github_logo.png" alt="GitHub" /></a>
  </div>
</div>