// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace is ReentrancyGuard {
    address payable public immutable feeAccount;
    uint256 public immutable feePercent;
    uint256 public itemCount;
    address payable public tokenAddress;

    struct Item {
        uint256 itemId;
        IERC721 nft;
        uint256 tokenId;
        uint256 price;
        address payable owner;
        bool forSale;
    }

    mapping(uint256 => Item) public items;
    mapping(address => Item[]) public itemsOwner;

    event Mint(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        address indexed owner,
        Item item
    );

    event Offered(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price
    );

    event Bought(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed buyer
    );

    constructor(uint256 _feePercent, address _tokenAddress) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
        tokenAddress = payable(_tokenAddress);
    }

    function mint(
        IERC721 _nft,
        uint256 _tokenId
    ) external nonReentrant {
        itemCount++;

        Item memory item = Item(
            itemCount,
            _nft,
            _tokenId,
            0,
            payable(msg.sender),
            false
        );

        items[itemCount] = item;

        emit Mint(itemCount, address(_nft), _tokenId, msg.sender, item);
    }

    function forSale(IERC721 _nft, uint256 _price, uint256 _tokenId) public {
        Item memory item = items[_tokenId];
        item.forSale = true;
        item.price = _price;

        items[_tokenId] = item;

        _nft.transferFrom(msg.sender, address(this), _tokenId);
        emit Offered(item.itemId, address(_nft), _tokenId, _price);
    }

    function purchaseItem(uint256 _itemId) external payable nonReentrant {
        uint256 _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");

        IERC20(tokenAddress).transferFrom(msg.sender, item.owner, item.price);
        IERC20(tokenAddress).transferFrom(msg.sender, feeAccount, _totalPrice - item.price);

        item.owner = payable(msg.sender);

        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        items[_itemId] = item;
        items[_itemId].forSale = false;

        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            msg.sender
        );
    }

    function getTotalPrice(uint256 _itemId) public view returns (uint256) {
        return ((items[_itemId].price * (100 + feePercent)) / 100);
    }
}