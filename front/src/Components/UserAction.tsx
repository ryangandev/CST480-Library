import React from 'react';
import { Box, Fab } from '@mui/material';
import { Check, Save } from '@mui/icons-material';
import {CircularProgress} from '@mui/material';

// interface params {
//     field: string;
// }
// const UserActions = ({params, rowid, setRowId}) => {
//     const [loading, setLoading] = React.useState(false);
//     const [success, setSuccess] = React.useState(false);

//     return (
//         <Box
//             sx = {{
//                 m:1,
//                 position: 'relative',
//             }}
//             >
//                 { success ? (
//                     <Fab
//                         color='primary'
//                         sx= {{
//                             width: 40,
//                             height: 40,
//                             bgcolor: 'red',
//                             '&:hover': {bgcolor: 'green'}
//                         }}
//                         >
//                         <Check />
//                     </Fab>
//                 ) : (
//                     <Fab
//                     color='primary'
//                     sx= {{
//                         width: 40,
//                         height: 40,
//                     }}
//                     disabled = {params.id !== rowid || loading}
//                     >
//                     <Save />
//                 </Fab>
//                 )}
//                 {loading && 
//                     (<CircularProgress size={52} sx={{color: 'green', position: 'absolute',  top:-6, left: -6, zIndex:1 }} />
//         </Box>
//     );
// };

// export default UserActions;