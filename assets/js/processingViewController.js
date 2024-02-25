const TerrainWandererContainer = document.getElementById('TerrainWanderer');

TerrainWandererContainer.classList.add('hidden');

function enableTerrainWanderer() {
    if (TerrainWandererContainer.classList.contains('hidden')) {
        
        TerrainWandererContainer.classList.remove('hidden');
    } else {
        
        TerrainWandererContainer.classList.add('hidden');
    }
}

function hideProcessingViews() {
    if (!TerrainWandererContainer.classList.contains('hidden')) {

        TerrainWandererContainer.classList.add('hidden');
    }
}