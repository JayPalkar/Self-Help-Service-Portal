import { Box, Header } from '@cloudscape-design/components'
import React from 'react'

const TasksPage = () => {
  return (
    <div>
      <Box>
        <Header variant="h1">Tasks</Header>
        <p>View and manage all your assigned tasks.</p>
        {/* Tasks specific content here */}
      </Box>
    </div>
  )
}

export default TasksPage