import { PrimaryKeyProp, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Entity } from './Entity';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class SystemSubscriptionOwner {
  [PrimaryKeyProp]?: 'systemSubscription';
  systemSubscription!: Ref<SystemSubscription>;
  entity!: Ref<Entity>;
}

export const SystemSubscriptionOwnerSchema = defineEntity({
  class: SystemSubscriptionOwner,
  schema: 'tenants',
  properties: {
    systemSubscription: () => p.oneToOne(SystemSubscription).primary().ref().updateRule('no action').deleteRule('no action'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').index('system_subscription_owner_idx_entity'),
  },
});
