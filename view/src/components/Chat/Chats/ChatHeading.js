import React from 'react'
import { FaVideo, FaUserPlus } from 'react-icons/fa'
import { MdMoreHoriz } from 'react-icons/md'

export default function ({ name, numberOfUsers }) {

  return (
    <div className="chat-header">
      <div className="user-info">
        <div className="user-name">{name}</div>
        <div className="status">
          <div className="indicator"></div>
          <span>{numberOfUsers ? numberOfUsers : null}</span>
        </div>
      </div>
      <div className="options">
        <FaVideo />
        <FaUserPlus />
        <MdMoreHoriz />
      </div>
    </div>
  )
}