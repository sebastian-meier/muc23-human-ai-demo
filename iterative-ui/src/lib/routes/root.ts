import Cluster from '../../views/pages/cluster.svelte'
import List from '../../views/pages/list.svelte'

export const routes = {
  '/': List,
  '/cluster/:id': Cluster,
}
