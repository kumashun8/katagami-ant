import React, { useEffect } from 'react'
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
import { indigo } from '@material-ui/core/colors'
import { convertBoolToNumOfTiles, convertNumToBoolOfTiles } from 'libs/format'
import { saveSelectedTiles, savedTiles } from 'libs/tile'

const useStyles = makeStyles(theme => ({
  name: {
    marginLeft: props => (props.ruby.length === 3 ? -4 : 0),
    fontSize: 20,
  },
  tile: {
    color: indigo[600],
    fontSize: 20,
  },
}))

export default props => {
  const {
    name,
    i,
    selectedIndex,
    setSelectedIndex,
    selectedTiles,
    setSelectedTiles,
    setTileIsSelectable,
    isEditing,
    setIsEditing,
  } = props
  const classes = useStyles({ ruby: name.ruby })
  const isFocused = selectedIndex === i
  const isEditingThis = isFocused && isEditing
  const convertedSelectedTiles = convertBoolToNumOfTiles(selectedTiles)

  const handleSelectThis = () => {
    if (!(isEditing || isFocused)) {
      setTileIsSelectable(false)
      setSelectedTiles(convertNumToBoolOfTiles(savedTiles(i)))
      setSelectedIndex(i)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    setTileIsSelectable(false)
    saveSelectedTiles(convertedSelectedTiles, i)
    setSelectedTiles(new Array(9).fill(false))
    setSelectedIndex(i + 1)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setTileIsSelectable(true)
    setSelectedTiles(convertNumToBoolOfTiles(savedTiles(i)))
    setSelectedIndex(i)
  }

  const handleCancelEdit = () => {
    setSelectedTiles(new Array(9).fill(false))
    setTileIsSelectable(false)
    setIsEditing(false)
  }

  useEffect(() => {
    if (isEditingThis) {
      setSelectedTiles(convertNumToBoolOfTiles(savedTiles(i)))
    }
  }, [isEditingThis, i, setSelectedTiles])

  console.log(typeof name.ruby.length)

  const ActivatedButtons = () => {
    if (isEditingThis) {
      return (
        <div>
          <Button color="primary" onClick={handleSave}>
            <Check />
          </Button>
          <Button color="secondary" onClick={handleCancelEdit}>
            <Cancel />
          </Button>
        </div>
      )
    }
    return (
      <Button color="default" onClick={handleEdit} disabled={!isFocused}>
        <Edit />
      </Button>
    )
  }

  const RubyLabelName = () => (
    <ruby>
      {name.kanji}
      <rt>{name.ruby}</rt>
    </ruby>
  )

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
        <Grid container className={classes.textWrapper}>
          <Grid item xs={4} className={classes.name}>
            <RubyLabelName />
          </Grid>
          <Grid item xs={4} className={classes.tile}>
            {isEditingThis ? convertedSelectedTiles : savedTiles(i)}
          </Grid>
        </Grid>
      </ListItemText>
      <ActivatedButtons />
    </ListItem>
  )
}