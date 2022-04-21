import React from 'react';
import { FriendName } from '../../styledComponents/FriendName';
import { SecBgDiv } from '../../styledComponents/SecBgDiv';
import { Text } from '../../styledComponents/Text';
import StyledFriend from '../../styledComponents/StyledFriend';
import "./friend.css";

function Friend({ username, name, imgloc, active, onClick }) {

    return (
        <StyledFriend 
        className={`frnd-ctn ${active ? "frnd-ctn--active" : "" }`}
        onClick={ onClick }>

            <div className="frnd-left-ctn">
                <img src={ imgloc } alt="contact-img" />
            </div>

            <div className="frnd-rgt-ctn">
                <FriendName>
                    {
                        name
                    }
                </FriendName>

                <Text>
                    @{
                        username
                    }
                </Text>
            </div>
        </StyledFriend>
    );
};

export default Friend;