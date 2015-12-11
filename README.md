# Wizard Duel

Realtime combat/strategy game built with Node, ionic and socket.io

## Event Api

### App Startup

#### Join Battle

emitted by client when user pushes the 'Duel' button.

#### Begin Battle

emitted by server when battle begins. Consumed by client to change state to 'in battle' and begins the battle clock.

### Attack Response Cycle

#### Attack Power Up

emitted by client when attack spell is initiated.

#### Attack

emitted (client) when attack spell is actually sent (after power slider)
Server will be looking for the following data:
- affinity
- power (calculated based on )
- crit (boolean)
- type

#### Perry

emitted by client when attacked player sends a defend spell to defend against the attack (after power slider).
Server will be looking for the following data:
- affinity
- power (calculated based on )
- crit (boolean)
- type

#### Repost

emitted by client when attacked player sends a counter spell (after power slider)
Server will be looking for the following data:
- affinity
- power (calculated based on )
- crit (boolean)
- type

### Other Spells

#### Recover

emitted by client restores health for the caster.

#### Defend

emitted by client. Adds a defense timer that mitigates some damage sent to the caster
