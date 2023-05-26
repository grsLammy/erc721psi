// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../utils/AccessProtected.sol";
import "erc721psi/contracts/ERC721Psi.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import { IERC721Receiver } from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract LandMinter_LIGHT is ERC721Psi, AccessProtected, IERC721Receiver {
    using Strings for uint256;

    // VARIABLES

    string private baseURI;
    string private baseExtension = ".json";
    uint256 private constant TOTAL_PLOTS = 90424;

    // CONSTRUCTOR

    constructor() ERC721Psi("Land Minter", "LM") {
        baseURI = "";
    }

    // PUBLIC FUNCTIONS

    /**
     * safeTransferFrom - where msg.sender == address(this)
     *
     * @param from - owner of the token or sender
     * @param to - receiver of the token
     * @param tokenId - tokenId to transfer
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override onlyAdmin {
        IERC721(address(this)).safeTransferFrom(from, to, tokenId, "");
    }

    // INTERNAL FUNCTIONS

    /**
     * @notice - returns the current baseURI when invoked
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // EXTERNAL FUNCTIONS

    /**
     * @notice - mint LAND
     * @dev - callable only by admin
     *
     * @param _quantity - number of LANDs to mint
     */
    function mintLand(uint256 _quantity) external onlyAdmin {
        require(
            _quantity <= TOTAL_PLOTS,
            "LandMinter: _quantity param of mintLands cannot be greater than the amount of TOTAL_PLOTS"
        );
        _safeMint(address(this), _quantity);
        require(totalSupply() <= TOTAL_PLOTS, "LandMinter: totalSupply can exceed the amount of TOTAL_PLOTS");
    }

    /**
     * @notice - Get Token ID by Coordinates
     * @dev - callable only by admin
     *
     * @param _newBaseURI - new base URI to replace the current base URI
     */
    function setBaseURI(string calldata _newBaseURI) external onlyAdmin {
        baseURI = _newBaseURI;
    }

    /**
     * @notice - returns the baseURI + tokenID + baseExtension as tokenURI
     *
     * @param tokenId - tokenId to fetch tokenURI of
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Psi: URI query for nonexistent token");

        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), baseExtension)) : "";
    }

    /**
     * @notice - get current base URI
     */
    function getBaseURI() external view returns (string memory) {
        return _baseURI();
    }

    /**
     * @notice - ERC721Receiver implementer
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
