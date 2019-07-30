<template>
  <div class="game-container">
    <Popup :game-paused="gamePaused" @new-game="createGame" @get-scores="getHighScores" />
    <div id="stage"></div>
  </div>
</template>

<style lang="sass" src="./Game.sass" />
<script lang="ts" src="./Game.ts" />
