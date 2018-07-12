// IMPORT
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import keycode from 'keycode';
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import myData from './data/DataForTable.json';
import TextField from '@material-ui/core/TextField';

// Scoped Counter
let counter = 0;


// Column info, Add or remove columns here. 
const columnData = [

  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  { id: "gender", numeric: false, disablePadding: false, label: "Gender" },
  { id: "company", numeric: false, disablePadding: false, label: " Company" },
  { id: "email", numeric: false, disablePadding: false, label: " Email" },
  { id: "isActive", numeric: false, disablePadding: false, label: "Active" },
  { id: "picture", numeric: false, disablePadding: false, label: "Picture" }

];

// Table Header Class. 
class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? "none" : "default"}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

// Theme integration
const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

// Toolbar functions
let EnhancedTableToolbar = props => {
  const { numSelected, classes, value, handleSearch, selectedID, data } = props;
  function handleDelete (){
    if(data.length === selectedID.length){ 
      console.log('"Removing" EVERYTHING!');
    }
    else {
      for(let i = 0; i < data.length; i++){
      for(let l = 0; l < selectedID.length; l++){
        if(data[i].id === selectedID[l]){
          console.log('"Removing" '+ data[i].name);
        
        }
      }
      }
    }
  };

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
      
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
          
        ) : (
          <Typography variant="title" id="tableTitle">
            People
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" >
            
              <DeleteIcon onClick= {handleDelete} />
            </IconButton>
          </Tooltip>
        ) : (
          <div>
          
          <TextField  
          placeholder="Search"
          autoComplete="on"
          onChange={handleSearch} 
          value={value}/>
          </div>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  selectedID: PropTypes.array.isRequired,
  data: PropTypes.array,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

// Table class || Main class to be exported 
class EnhancedTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    // Get data from Data files
    let arr = [];
    Object.keys(myData).forEach(function(keyNo) {
        counter += 1;
        myData[keyNo].count = counter;
        Object.keys(myData[keyNo]).forEach(function(key) {
        
        // Convert Boolean to string for view and sort
        if(typeof(myData[keyNo][key]) === "boolean"){
            if(myData[keyNo][key]){ myData[keyNo][key] = "True";}
            else {myData[keyNo][key] = "False";}
        }
        });
        arr.push(myData[keyNo]);
      
    });

    this.state = {
      order: "asc",
      orderBy: "name",
      selected: [],
      searchValue: "",
      data: arr.sort((a, b) => (a.name < b.name ? -1 : 1)),
      filterData: arr.sort((a, b) => (a.name < b.name ? -1 : 1)),
      page: 0,
      rowsPerPage: 10
    };
  }
  
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    const filterData =
      order === "desc"
        ? this.state.filterData.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.filterData.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ filterData, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.counter) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if(this.state.selected.length >= this.state.data.length){this.state.selected.splice(0, this.state.selected.length - 1);}
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;
  
  handleKeyDown = (event, id) => {
    if (keycode(event) === 'space') {
      this.handleClick(event, id);
    }
  };

  // Search bar
  handleSearch = (event) => {
    
    // look at the original data and assume no results.
    const {data} = this.state
    let filteredDatas = []
    filteredDatas = data.filter(e => {
        let matches = Object.values(e)
        let retVal = false;
        matches.forEach(e => {
            const regex = new RegExp(event.target.value, 'gi')
            // If anything in the object is a string and matches the search then mark it a-okay.
            if (typeof e === 'string')
            if(e.match(regex)){
              retVal = true;
            }
        })
        return retVal;
    })
  //  console.log(filteredDatas)
    this.setState({filterData: filteredDatas, searchValue: event.target.value})
}

  render() {
    const { classes } = this.props;
    const { filterData, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filterData.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} selectedID={selected} data={filterData} handleSearch={this.handleSearch} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={filterData.length}
            />
            <TableBody>
              {filterData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.name}
                      </TableCell>
                      <TableCell >{n.gender}</TableCell>
                      <TableCell >{n.company}</TableCell>
                      <TableCell >{n.email}</TableCell>
                      <TableCell >{n.isActive}</TableCell>
                      <TableCell >{n.picture}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={filterData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EnhancedTable);



