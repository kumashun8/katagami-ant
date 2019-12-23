import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Grid,
} from '@material-ui/core'
import {
  RadioButtonUnchecked,
  RadioButtonChecked,
  Edit,
  Cancel,
  Check,
} from '@material-ui/icons'
import { selectedTileNumbers, selectedTilesArray } from 'libs/format'
import { saveSelectedTiles, savedTiles, tilesAreSaved } from 'libs/tile'
import { indigo } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
  tile: {
    color: indigo[600],
  },
}))

export default props => {
  const {
    name,
    i,
    selectedIndex,
    setSelectedIndex,
    tileIsSelectable,
    selectedTiles,
    setSelectedTiles,
    setTileIsSelectable,
  } = props
  const classes = useStyles()
  const isFocused = selectedIndex === i
  const [isSaved, setIsSaved] = useState(tilesAreSaved(i))
  const [isEditing, setIsEditing] = useState(false)
  const convertedSelectedTiles = selectedTileNumbers(selectedTiles)

  const displayedTiles = () => {
    if (isSaved) {
      return savedTiles(i)
    }
    if (isFocused) {
      return convertedSelectedTiles
    }
    return '-'
  }

  const handleTileSelectabe = () => {
    setTileIsSelectable(true)
  }

  const handleTileUnselectabe = () => {
    setTileIsSelectable(false)
  }

  const handleSelectThis = () => {
    setSelectedTiles(
      isSaved ? selectedTilesArray(savedTiles(i)) : new Array(9).fill(false)
    )
    setTileIsSelectable(false)
    setSelectedIndex(i)
  }

  const handleMoveToNext = () => {
    setTileIsSelectable(false)
    setIsSaved(true)
    setSelectedIndex(i + 1)
  }

  const handleSaveSelectedTiles = () => {
    saveSelectedTiles(convertedSelectedTiles, i)
    setSelectedTiles(new Array(9).fill(false))
    setIsSaved(true)
    setTileIsSelectable(false)
    // handleMoveToNext()
  }

  const handleEditSelectedTiles = () => {
    setSelectedTiles(selectedTilesArray(savedTiles(i)))
    setTileIsSelectable(true)
    setSelectedIndex(i)
    setIsSaved(false)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setSelectedTiles(new Array(9).fill(false))
    setIsSaved(true)
    setTileIsSelectable(false)
    setIsEditing(false)
  }

  useEffect(() => {
    if (isSaved) {
      setSelectedTiles(selectedTilesArray(savedTiles(i)))
    }
  }, [isSaved])

  const ActivatedButtons = () => {
    if (isSaved) {
      return (
        <Button color="default" onClick={handleEditSelectedTiles}>
          <Edit />
        </Button>
      )
    }
    if (isEditing) {
      return (
        <div>
          <Button color="primary" onClick={handleSaveSelectedTiles}>
            <Check />
          </Button>
          <Button color="secondary" onClick={handleCancelEdit}>
            <Cancel />
          </Button>
        </div>
      )
    }
    if (isFocused && tileIsSelectable) {
      return (
        <div>
          <Button color="primary" onClick={handleSaveSelectedTiles}>
            保存
          </Button>
          <Button color="secondary" onClick={handleTileUnselectabe}>
            戻る
          </Button>
        </div>
      )
    }
    return (
      <div>
        <Button color="primary" onClick={handleTileSelectabe}>
          あり
        </Button>
        <Button color="secondary" onClick={handleMoveToNext}>
          なし
        </Button>
      </div>
    )
  }

  return (
    <ListItem selected={isFocused}>
      <ListItemIcon onClick={handleSelectThis}>
        {isFocused ? (
          <RadioButtonChecked color="primary" />
        ) : (
          <RadioButtonUnchecked />
        )}
      </ListItemIcon>
      <ListItemText>
        <Grid container>
          <Grid item xs={6}>
            {name}
          </Grid>
          <Grid item xs={6} className={classes.tile}>
            {displayedTiles()}
          </Grid>
        </Grid>
      </ListItemText>
      <ActivatedButtons />
    </ListItem>
  )
}
